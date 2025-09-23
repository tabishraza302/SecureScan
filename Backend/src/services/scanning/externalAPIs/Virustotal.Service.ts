import axios, { AxiosResponse } from 'axios';

import Sleep from '../../../utils/Sleep.Types';
import ErrorHandler from '../../../utils/ErrorHandler';
import { VirustotalReportType } from '../../../types/Types';

class VirustotalService {
    private attempt: number;
    private delay: number;
    private readonly apiKeys: string[];
    private keyIndex: number;

    constructor(attempt: number = 10, delay: number = 2000) {
        this.attempt = attempt;
        this.delay = delay;

        const keys = process.env.VIRUS_TOTAL_KEYS;
        if (!keys) {
            console.error('VirusTotal API keys are missing');
            throw new ErrorHandler(500, 'VirusTotal API keys are missing');
        }
        this.apiKeys = keys.split(',');
        this.keyIndex = 0;
    }

    public async RequestScan(url: string): Promise<VirustotalReportType> {
        const fullUrl =
            url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
        console.log(`[VirusTotal] Starting scan for URL: ${fullUrl}`);

        const encodedParams = new URLSearchParams({ url: fullUrl }).toString();
        // console.log(`[VirusTotal] Request params: ${encodedParams}`);

        const headers = this.getHeaders('application/x-www-form-urlencoded');
        // console.log(`[VirusTotal] Request headers:`, JSON.stringify(headers, null, 2));

        try {
            const startTime = Date.now();
            const response: AxiosResponse = await axios.post(
                'https://www.virustotal.com/api/v3/urls',
                encodedParams,
                { headers }
            );
            const requestTime = Date.now() - startTime;
            console.log(
                `[VirusTotal] Scan request completed in ${requestTime}ms. Response status: ${response.status}`
            );
            console.log(`[VirusTotal] Response data:`, JSON.stringify(response.data, null, 2));

            const resultLink = response?.data?.data?.links?.self;
            if (!resultLink) {
                console.error(`[VirusTotal] No result link in response`);
                throw new ErrorHandler(502, 'Failed to retrieve scan result link from VirusTotal.');
            }
            // console.log(`[VirusTotal] Result link: ${resultLink}`);

            console.info(
                `Scan requested for URL: ${url}. Waiting ${
                    this.delay / 1000
                }s before polling result...`
            );
            await Sleep(this.delay);

            return await this.RequestReport(resultLink);
        } catch (error: any) {
            const status = error?.response?.status || 500;
            const message = error?.response?.data?.error?.message || 'VirusTotal scan failed.';
            console.error(`[VirusTotal] Request failed with status ${status}: ${message}`);
            console.error(`[VirusTotal] Full error:`, error);

            throw new ErrorHandler(status, message);
        }
    }

    private async RequestReport(url: string): Promise<VirustotalReportType> {
        console.log(`[VirusTotal] Starting result polling for: ${url}`);
        const headers = this.getHeaders();

        for (let attempt = 1; attempt <= this.attempt; attempt++) {
            try {
                // console.log(`[VirusTotal] Polling attempt ${attempt}/${this.attempt}`);
                const startTime = Date.now();
                const response = await axios.get(url, { headers });
                const requestTime = Date.now() - startTime;
                console.log(
                    `[VirusTotal] Poll request ${attempt} completed in ${requestTime}ms. Status: ${response.status}`
                );

                const data = response?.data?.data?.attributes;

                if (!data) {
                    console.warn(`[VirusTotal] No data in response on attempt ${attempt}`);
                    continue;
                }

                if (data.status === 'completed') {
                    console.info(`VirusTotal result ready after ${attempt} attempt(s).`);
                    return {
                        stats: data.stats,
                        antivirusResults: data.results,
                    };
                }

                console.warn(
                    `VirusTotal result not ready (attempt ${attempt}/${
                        this.attempt
                    }). Retrying in ${this.delay / 1000}s...`
                );
                await Sleep(this.delay);
            } catch (error) {
                console.warn(`Error on VirusTotal result polling (attempt ${attempt}):`, error);

                if (axios.isAxiosError(error)) {
                    const status = error.response?.status || 500;
                    const message = error.response?.data?.error?.message || 'VirusTotal API error';

                    // If it's a 4xx error, it's likely a client error — stop retrying
                    if (status >= 400 && status < 500) throw new ErrorHandler(status, message);
                }

                // If it's the last attempt, throw generic error
                if (attempt === this.attempt)
                    throw new ErrorHandler(
                        500,
                        'VirusTotal scan result polling failed after maximum attempts.'
                    );

                await Sleep(this.delay);
            }
        }

        console.error('VirusTotal scan result polling timed out.');
        throw new ErrorHandler(408, 'Failed to get result. Timeout.');
    }

    private getHeaders(contentType: string = 'application/json') {
        const apiKey = this.apiKeys[this.keyIndex % this.apiKeys.length];
        this.keyIndex++;
        return {
            accept: 'application/json',
            'x-apikey': apiKey,
            'content-type': contentType,
        };
    }
}

export default VirustotalService;
