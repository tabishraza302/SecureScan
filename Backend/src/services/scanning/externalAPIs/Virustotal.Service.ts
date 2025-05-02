import axios, { AxiosResponse } from "axios";

import Sleep from "../../../utils/Sleep.Types";
import ErrorHandler from "../../../utils/ErrorHandler";
import { VirustotalReportType } from "../../../types/Types";


class VirustotalService {
    private attempt: number;
    private delay: number;
    private readonly apiKey: string | undefined;

    constructor(attempt: number = 20, delay: number = 4000) {
        this.attempt = attempt;
        this.delay = delay;

        this.apiKey = process.env.VIRUS_TOTAL_KEY;
        if(!this.apiKey) {
            console.error("VirusTotal API key is missing");
            throw new ErrorHandler(500, "VirusTotal API key is missing");
        }
    }

    public async RequestScan(url: string): Promise<VirustotalReportType> {
        const encodedParams = new URLSearchParams({ url }).toString();
        const headers = this.getHeaders("application/x-www-form-urlencoded");
    
        try {
            const response: AxiosResponse = await axios.post("https://www.virustotal.com/api/v3/urls", encodedParams, { headers });
    
            const resultLink = response?.data?.data?.links?.self;
            if (!resultLink)
                throw new ErrorHandler(502, "Failed to retrieve scan result link from VirusTotal.");
    
            console.info(`Scan requested for URL: ${url}. Waiting ${this.delay / 1000}s before polling result...`);
            await Sleep(this.delay);
        
            return await this.RequestReport(resultLink);
        } catch (error: any) {
            const status = error?.response?.status || 500;
            const message = error?.response?.data?.error?.message || "VirusTotal scan failed.";
            console.error("VirusTotal scan request failed:", message);
        
            throw new ErrorHandler(status, message);
        }
    }

    private async RequestReport(url: string): Promise<VirustotalReportType> {
        const headers = this.getHeaders();
      
        for (let attempt = 1; attempt <= this.attempt; attempt++) {
            try {
                const response = await axios.get(url, { headers });
                const data = response?.data?.data?.attributes;
      
                if (!data) {
                    console.warn(`No data in response on attempt ${attempt}`);
                    continue;
                }
      
                if (data.status === "completed") {
                    console.info(`VirusTotal result ready after ${attempt} attempt(s).`);
                    return {
                        stats: data.stats,
                        antivirusResults: data.results
                    };
                }
      
                console.warn(`VirusTotal result not ready (attempt ${attempt}/${this.attempt}). Retrying in ${this.delay / 1000}s...`);
                await Sleep(this.delay);        
            } catch (error) {
                console.warn(`Error on VirusTotal result polling (attempt ${attempt}):`, error);
            
                if (axios.isAxiosError(error)) {
                    const status = error.response?.status || 500;
                    const message = error.response?.data?.error?.message || "VirusTotal API error";
                    
                    // If it's a 4xx error, it's likely a client error — stop retrying
                    if (status >= 400 && status < 500) 
                        throw new ErrorHandler(status, message);
                }
            
                // If it's the last attempt, throw generic error
                if (attempt === this.attempt) 
                    throw new ErrorHandler(500, "VirusTotal scan result polling failed after maximum attempts.");
            
                await Sleep(this.delay);
            }
            
        }
      
        console.error("VirusTotal scan result polling timed out.");
        throw new ErrorHandler(408, "Failed to get result. Timeout.")
    }
      
    private getHeaders(contentType: string = "application/json") {
        if (this.apiKey) {
            return {
                "accept": "application/json",
                "x-apikey": this.apiKey,
                "content-type": contentType
            }
        }

        throw new ErrorHandler(500, "Virustotal Api key missing.")
    }
}


export default VirustotalService;
