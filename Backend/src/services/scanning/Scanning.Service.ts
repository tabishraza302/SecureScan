import { Op } from 'sequelize';

import ScanModel from '../../database/models/Scan.Model';
import ApiResponseModel from '../../database/models/ApiResponse.Model';

import ScoreService from '../score/Score.Service';
import ErrorHandler from '../../utils/ErrorHandler';
import { VirustotalReportType } from '../../types/Types';
import URLScanService from './externalAPIs/URLScan.Service';
import VirustotalService from './externalAPIs/Virustotal.Service';
import { UrlScanResultTypes } from '../../types/externalAPIs/URLScan.Types';

class ScanningService {
    private scoreService: ScoreService;
    private urlscanService: URLScanService;
    private virustotalService: VirustotalService;

    constructor() {
        this.scoreService = new ScoreService();
        this.urlscanService = new URLScanService();
        this.virustotalService = new VirustotalService();
    }

    public async ScanDomain(domain: string): Promise<number> {
        const totalStartTime = Date.now();
        console.log(`[Scanning] Starting scan for domain: ${domain}`);

        try {
            // rate limiting: wait 500ms between scans
            await new Promise((resolve) => setTimeout(resolve, 500));

            // try to get results from both APIs and handle failures gracefully
            const scanStartTime = Date.now();
            const [virustotalResult, urlscanResult] = await Promise.allSettled([
                this.virustotalService.RequestScan(domain),
                this.urlscanService.ScanDomain(domain),
            ]);
            const scanTime = Date.now() - scanStartTime;
            console.log(`[Scanning] API calls completed in ${scanTime}ms`);

            const virustotalData =
                virustotalResult.status === 'fulfilled' ? virustotalResult.value : null;
            const urlscanData = urlscanResult.status === 'fulfilled' ? urlscanResult.value : null;

            // log results
            if (virustotalData) {
                console.log('VirusTotal scan successful');
            } else {
                console.error(
                    'VirusTotal scan failed:',
                    virustotalResult.status === 'rejected'
                        ? virustotalResult.reason
                        : 'Unknown error'
                );
            }

            if (urlscanData) {
                console.log('URLScan scan successful');
            } else {
                console.error(
                    'URLScan scan failed:',
                    urlscanResult.status === 'rejected' ? urlscanResult.reason : 'Unknown error'
                );
            }

            // require at least one successful scan
            if (!virustotalData && !urlscanData) {
                throw new ErrorHandler(
                    500,
                    'Both scanning services failed. Please try again later.'
                );
            }

            const scoreStartTime = Date.now();
            const score = this.scoreService.calculateScore(virustotalData, urlscanData);
            const scoreTime = Date.now() - scoreStartTime;
            console.log(
                `[Scanning] Score calculation completed in ${scoreTime}ms. Final score: ${score}`
            );

            const saveStartTime = Date.now();
            await this.saveToDatabase(domain, score, virustotalData, urlscanData);
            const saveTime = Date.now() - saveStartTime;
            console.log(`[Scanning] Database save completed in ${saveTime}ms`);

            const totalTime = Date.now() - totalStartTime;
            console.log(
                `[Scanning] Total scan process completed in ${totalTime}ms for domain: ${domain}`
            );

            return score;
        } catch (error) {
            console.error('Error during domain scan:', error);
            throw error;
        }
    }

    public async isDomainScanned(domain: string): Promise<boolean> {
        const sixDaysAgo = new Date();
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

        try {
            const recentScanCount = await ScanModel.count({
                where: { domain, scan_date: { [Op.gte]: sixDaysAgo } },
            });
            return recentScanCount > 0;
        } catch (error) {
            console.error('Error checking domain scan:', error);
            throw new ErrorHandler(500, 'Failed to check recent domain scan.');
        }
    }

    private async saveToDatabase(
        domain: string,
        score: number,
        VirustotalScanType: VirustotalReportType | null,
        URLScanResponse: UrlScanResultTypes | null
    ) {
        try {
            const apiResponses = [];

            if (VirustotalScanType) {
                apiResponses.push({
                    api_name: 'virustotal',
                    response: VirustotalScanType,
                });
            }

            if (URLScanResponse) {
                apiResponses.push({
                    api_name: 'urlscanio',
                    response: URLScanResponse,
                });
            }

            await ScanModel.create(
                {
                    domain,
                    score,
                    scanDate: new Date(),
                    status: 'completed',
                    ApiResponse: apiResponses,
                },
                { include: [{ model: ApiResponseModel, as: 'ApiResponse' }] }
            );
        } catch (error) {
            console.error(error);
            throw new ErrorHandler(500, 'Failed to save result to database.');
        }
    }
}

export default ScanningService;
