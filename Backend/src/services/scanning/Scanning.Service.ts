import { Op } from "sequelize";

import ScanModel from "../../database/models/Scan.Model";
import ApiResponseModel from "../../database/models/ApiResponse.Model";

import ScoreService from "../score/Score.Service";
import ErrorHandler from "../../utils/ErrorHandler";
import { VirustotalReportType } from "../../types/Types";
import URLScanService from "./externalAPIs/URLScan.Service";
import VirustotalService from "./externalAPIs/Virustotal.Service";
import { UrlScanResultTypes } from "../../types/externalAPIs/URLScan.Types";


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
        try {
            const [virustotalData, urlscanData] = await Promise.all([
                this.virustotalService.RequestScan(domain),
                this.urlscanService.ScanDomain(domain)
            ]);

            if (!virustotalData)
                throw new ErrorHandler(500, "VirusTotal result is empty.");

            if (!urlscanData)
                throw new ErrorHandler(500, "URLScan result is empty.");

            const score = this.scoreService.calculateScore(virustotalData, urlscanData);


            await this.saveToDatabase(domain, score, virustotalData, urlscanData);
            return score;
        } catch (error) {
            console.error("Error during domain scan:", error);
            throw error;
        }
    }

    public async isDomainScanned(domain: string): Promise<boolean> {
        const sixDaysAgo = new Date();
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

        try {
            const recentScanCount = await ScanModel.count({ where: { domain, scan_date: { [Op.gte]: sixDaysAgo } } });
            return recentScanCount > 0;
        } catch (error) {
            console.error("Error checking domain scan:", error);
            throw new ErrorHandler(500, "Failed to check recent domain scan.");
        }
    }

    private async saveToDatabase(domain: string, score: number, VirustotalScanType: VirustotalReportType, URLScanResponse: UrlScanResultTypes) {
        try {
            await ScanModel.create({
                domain,
                score,
                scanDate: new Date(),
                status: "completed",
                ApiResponse: [
                    {
                        api_name: "virustotal",
                        response: VirustotalScanType
                    },
                    {
                        api_name: "urlscanio",
                        response: URLScanResponse
                    }
                ]
            },
                { include: [{ model: ApiResponseModel, as: "ApiResponse" }] });
        } catch (error) {
            console.error(error)
            throw new ErrorHandler(500, "Failed to save result to database.");
        }
    }
}


export default ScanningService;