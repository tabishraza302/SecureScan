import axios from 'axios';

import Sleep from '../../../utils/Sleep.Types';
import ErrorHandler from '../../../utils/ErrorHandler';
import { URLScanScanResponseType, URLScanReportType } from '../../../types/Types';

class UrlScanService {
    private totalAttempt: number;
    private delay: number;
    private readonly apiKeys: string[];
    private keyIndex: number;

    constructor(totalAttempt: number = 8, delay: number = 2000) {
        this.totalAttempt = totalAttempt;
        this.delay = delay;

        const keys = process.env.URLSCANIO_KEYS;
        if (!keys) {
            console.error('URLScan.io API keys are missing');
            throw new ErrorHandler(500, 'URLScan.io API keys are missing');
        }
        this.apiKeys = keys.split(',');
        this.keyIndex = 0;
    }

    public async ScanDomain(domain: string): Promise<URLScanReportType> {
        const fullUrl =
            domain.startsWith('http://') || domain.startsWith('https://')
                ? domain
                : `https://${domain}`;
        console.log(`[URLScan] Starting scan for URL: ${fullUrl}`);

        const data = { url: fullUrl, visibility: 'public' };
        console.log(`[URLScan] Request data:`, JSON.stringify(data, null, 2));

        const apiKey = this.apiKeys[this.keyIndex % this.apiKeys.length];
        this.keyIndex++;
        const headers = {
            'API-Key': apiKey,
            'Content-Type': 'application/json',
        };
        // console.log(`[URLScan] Using API key index: ${(this.keyIndex - 1) % this.apiKeys.length}`);
        // console.log(`[URLScan] Request headers:`, JSON.stringify(headers, null, 2));

        try {
            const startTime = Date.now();
            const response: URLScanScanResponseType = (
                await axios.post('https://urlscan.io/api/v1/scan/', data, { headers })
            )?.data;
            const requestTime = Date.now() - startTime;
            console.log(
                `[URLScan] Scan request completed in ${requestTime}ms. Response:`,
                JSON.stringify(response, null, 2)
            );

            if (!response?.api) {
                console.error(`[URLScan] No API field in response`);
                throw new ErrorHandler(500, 'Failed to scan domain.');
            }

            const { api } = response;
            console.log(`[URLScan] Result API URL: ${api}`);

            console.log(`[URLScan] Waiting ${this.delay / 1000}s before polling result...`);
            await Sleep(this.delay);
            return await this.FetchResult(api);
        } catch (error: any) {
            console.error(`[URLScan] Scan request failed:`, error);
            throw new ErrorHandler(error?.status || 500, 'Failed to scan the URL');
        }
    }

    private async FetchResult(ResultLink: string): Promise<URLScanReportType> {
        console.log(`[URLScan] Starting result polling for: ${ResultLink}`);

        for (let attempt = 0; attempt < this.totalAttempt; attempt++) {
            try {
                // console.log(`[URLScan] Polling attempt ${attempt + 1}/${this.totalAttempt}`);
                const startTime = Date.now();
                const response: any = await axios.get(ResultLink);
                const requestTime = Date.now() - startTime;
                console.log(
                    `[URLScan] Poll request ${attempt + 1} completed in ${requestTime}ms. Status: ${
                        response.status
                    }`
                );

                if (response?.data) {
                    console.info(`Result fetched on attempt ${attempt + 1}`);
                    console.log(
                        `[URLScan] Full response data:`,
                        JSON.stringify(response.data, null, 2)
                    );

                    const { lists, page, stats, verdicts } = response.data;
                    const { domains, servers, urls, linkDomains } = lists;
                    return {
                        lists: {
                            domains,
                            servers,
                            urls,
                            linkDomains,
                        },
                        page,
                        stats,
                        verdicts,
                    };
                }

                console.warn(
                    `URLScan result not ready (attempt ${attempt}/${
                        this.totalAttempt
                    }). Retrying in ${this.delay / 1000}s...`
                );
                await Sleep(this.delay);
            } catch (error) {
                // console.error(`[URLScan] Error on polling attempt ${attempt + 1}:`, error);

                if (axios.isAxiosError(error)) {
                    const status = error.response?.status || 500;
                    const message = error.response?.data?.error?.message || 'URLScan API error';

                    // If it's a 4xx error, it's likely a client error — stop retrying
                    if (status !== 404 && status >= 400 && status < 500) {
                        console.warn(
                            `[URLScan] Client error ${status}, stopping retries: ${message}`
                        );
                        throw new ErrorHandler(status, message);
                    }
                }

                // If it's the last attempt, throw generic error
                if (attempt === this.totalAttempt) {
                    console.warn(`[URLScan] Max attempts reached, giving up`);
                    throw new ErrorHandler(
                        500,
                        'URLScan scan result polling failed after maximum attempts.'
                    );
                }

                console.log(`[URLScan] Retrying in ${this.delay / 1000}s...`);
                await Sleep(this.delay);
            }
        }

        console.log('Failed to fetch result, Timeout');
        throw new ErrorHandler(408, 'Failed to fetch result. Timeout');
    }
}

export default UrlScanService;
