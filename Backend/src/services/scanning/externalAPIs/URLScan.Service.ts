import axios from "axios";

import Sleep from "../../../utils/Sleep.Types";
import ErrorHandler from "../../../utils/ErrorHandler";
import { URLScanScanResponseType, URLScanReportType } from "../../../types/Types";


class UrlScanService {
    private totalAttempt: number;
    private delay: number;

    constructor(totalAttempt: number = 10, delay: number = 4000) {
        this.totalAttempt = totalAttempt;
        this.delay = delay;
    }

    public async ScanDomain(domain: string): Promise<URLScanReportType> {
        const data = { url: domain, visibility: "public" };
        const headers = {
            "API-Key": process.env.URLSCANIO_KEY,
            "Content-Type": "application/json",
        };

        try {
            const response: URLScanScanResponseType = (await axios.post("https://urlscan.io/api/v1/scan/", data, { headers }))?.data;
            if(!response?.api)
                throw new ErrorHandler(500, "Failed to scan domain.")

            const { api } = response;

            await Sleep(this.delay);
            return await this.FetchResult(api);
        } catch (error: any) {
            throw new ErrorHandler(error?.status || 500, "Failed to scan the URL",);
        }
    }

    private async FetchResult(ResultLink: string): Promise<URLScanReportType> {
        for (let attempt = 0; attempt < this.totalAttempt; attempt++) {
            try {
                const response: any = await axios.get(ResultLink);

                if (response?.data) {
                    console.info(`Result fetched on attempt ${attempt + 1}`);

                    const { lists, page, stats, verdicts } = response.data;
                    const { domains, servers, urls, linkDomains } = lists;
                    return {
                        lists: {
                            domains, 
                            servers, 
                            urls, 
                            linkDomains
                        },
                        page,
                        stats,
                        verdicts
                    };
                }

                console.warn(`URLScan result not ready (attempt ${attempt}/${this.totalAttempt}). Retrying in ${this.delay / 1000}s...`);
                await Sleep(this.delay);  
            } catch(error) {            
                if (axios.isAxiosError(error)) {
                    const status = error.response?.status || 500;
                    const message = error.response?.data?.error?.message || "URLScan API error";
                    
                    // If it's a 4xx error, it's likely a client error — stop retrying
                    if (status !== 404 && status >= 400 && status < 500) { 
                        console.warn(`Error on URLScan result polling (attempt ${attempt}):`, error);
                        throw new ErrorHandler(status, message);
                    }
                }
            
                // If it's the last attempt, throw generic error
                if (attempt === this.totalAttempt) {
                    console.warn(`Error on URLScan result polling (attempt ${attempt}):`, error);
                    throw new ErrorHandler(500, "URLScan scan result polling failed after maximum attempts.");
                }
            
                await Sleep(this.delay);
            }
        }

        console.log("Failed to fetch result, Timeout");
        throw new ErrorHandler(408, "Failed to fetch result. Timeout")
    }
}


export default UrlScanService;