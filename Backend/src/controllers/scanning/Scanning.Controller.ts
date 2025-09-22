import { Request, Response, NextFunction } from "express";

import ErrorHandler from "../../utils/ErrorHandler";
import { success } from "../../utils/ResponseHelper";
import ScanCRUDService from "../../services/CRUD/Scan.CRUD.Service";
import ScanningService from "../../services/scanning/Scanning.Service";


class ScanningController {
    private scanningService: ScanningService;
    private scanCRUDService: ScanCRUDService;

    constructor() {
        this.scanningService = new ScanningService();
        this.scanCRUDService = new ScanCRUDService();

        this.GetScore = this.GetScore.bind(this);
        this.ScanDomain = this.ScanDomain.bind(this);
        this.GetFullReport = this.GetFullReport.bind(this);
    }

    public async ScanDomain(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { domain } = req.params;

        try {
            const isScannedAlready = await this.scanningService.isDomainScanned(domain);
            if (isScannedAlready) {
                const score = await this.scanCRUDService.GetScoreByDomain(domain)
                return success(res, 200, "", score)
            }

            const score = await this.scanningService.ScanDomain(domain);
            return success(res, 200, "", { score })
        } catch (error) {
            console.log(error)
            return next(error instanceof ErrorHandler ? error : new ErrorHandler(500, "Failed to scan domain."))
        }
    }

    public async GetScore(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { domain } = req.params;

        try {
            const score = (await this.scanCRUDService.GetScoreByDomain(domain))?.dataValues.score;
            const result = await this.scanCRUDService.GetScanSummary(domain);

            let maliciousCount = 0;
            let suspiciousCount = 0;
            let harmlessCount = 0;
            let totalLinksCount = 0;

            const response = result[0].dataValues.ApiResponse
            const { malicious, suspicious, harmless } = JSON.parse(response.find((res: any) => res.api_name === "virustotal").response).stats;
            const { malicious: maliciousFlag, totalLinks } = JSON.parse(response.find((res: any) => res.api_name === "urlscanio").response).stats;



            maliciousCount += (malicious + maliciousFlag);
            suspiciousCount += suspicious;
            harmlessCount += harmless;
            totalLinksCount += totalLinks;

            return success(res, 200, "", { score, maliciousCount, suspiciousCount, harmlessCount, totalLinksCount })
        } catch (error) {
            console.log(error)
            return next(error instanceof ErrorHandler ? error : new ErrorHandler(500, "Failed to get score."));
        }
    }

    public async GetFullReport(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { domain } = req.params;

        try {
            const result = await this.scanCRUDService.GetFullReport(domain);
            const { score, domain: scannedDomain, scan_date } = result[0]?.dataValues;

            const response = JSON.stringify(result[0].dataValues.ApiResponse);

            const virusTotalReport = JSON.parse(response).find((res: any) => res.api_name === "virustotal").response;
            const urlScanReport = JSON.parse(response).find((res: any) => res.api_name === "urlscanio").response;

            let summary = {
                maliciousCount: 0,
                suspiciousCount: 0,
                harmlessCount: 0,
                timeoutCount: 0,
                undetectedCount: 0,
                totalLinksCount: 0,
            }

            let engineReports: { [key: string]: string } = {};


            // const response = result[0].dataValues.ApiResponse
            const { stats: VirustotalStats, antivirusResults } = virusTotalReport;

            // Virustotal Data buildup
            const { malicious, suspicious, undetected, harmless, timeout } = VirustotalStats;
            for (const antivirus in antivirusResults) {
                const name: string = antivirusResults[antivirus].engine_name
                const value: string = antivirusResults[antivirus].result

                engineReports[name] = value;
            }

            summary.timeoutCount += timeout;
            summary.harmlessCount += harmless;
            summary.undetectedCount += undetected;
            summary.suspiciousCount += suspicious;

            // URLScan Data buildup
            const { urls: externalLinks } = urlScanReport.lists;
            const { malicious: URLScanMaliciousCount, totalLinks } = urlScanReport.stats;

            summary.totalLinksCount += totalLinks;
            summary.maliciousCount += (malicious + URLScanMaliciousCount);

            return success(res, 200, "", { score, scannedDomain, scan_date, summary, engineReports, externalLinks })
        } catch (error) {
            console.log(error)
            return next(error instanceof ErrorHandler ? error : new ErrorHandler(500, "Failed to get score."));
        }
    }
}


export default ScanningController;