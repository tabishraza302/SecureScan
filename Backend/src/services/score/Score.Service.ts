import { URLScanReportType, VirustotalReportType } from '../../types/Types';

// Engine weight priority map (higher means more trusted/impactful)
const ANTIVIRUS_WEIGHTS: Record<string, number> = {
    Kaspersky: 5,
    BitDefender: 5,
    'ESET-NOD32': 4,
    Microsoft: 4,
    Symantec: 4,
    Avast: 3,
    AVG: 3,
    Sophos: 3,
    ClamAV: 2,
    Malwarebytes: 3,
    // Default for others
    _default: 1.5,
};

const WEIGHTS = {
    virustotal: {
        malicious: -4,
        suspicious: -2,
        timeout: -1,
        engineDetectedLow: -5,
        engineDetectedHigh: -10,
    },
    urlscan: {
        maliciousVerdict: -20,
        riskyCountry: -10,
        riskyVisibility: -5,
        manyDomains: -5,
        mediumDomains: -3,
        repeatedDomainPenalty: -1.5,
        ipCountPenalty: -3,
        secureBonus: +5,
    },
};

class ScoreService {
    public calculateScore(
        virustotalData: VirustotalReportType | null,
        urlscanData: URLScanReportType | null
    ): number {
        const vtScore = virustotalData ? this.getVirustotalScore(virustotalData) : 0;
        const usScore = urlscanData ? this.getUrlscanScore(urlscanData) : 0;
        const rawScore = 100 + vtScore + usScore;
        return Math.max(0, Math.min(100, rawScore));
    }

    private getVirustotalScore(virustotal: VirustotalReportType): number {
        const { malicious = 0, suspicious = 0, timeout = 0 } = virustotal.stats || {};
        const engines = virustotal.antivirusResults || {};

        let score = 0;

        score += malicious * WEIGHTS.virustotal.malicious;
        score += suspicious * WEIGHTS.virustotal.suspicious;
        score += timeout * WEIGHTS.virustotal.timeout;

        // Detect based on engine reputation
        let weightedScore = 0;
        let detectedCount = 0;

        for (const [engineName, result] of Object.entries(engines)) {
            if (!result?.result || ['clean', 'unrated'].includes(result.result)) continue;
            detectedCount++;
            const weight = ANTIVIRUS_WEIGHTS[engineName] ?? ANTIVIRUS_WEIGHTS['_default'];
            weightedScore -= weight;
        }

        // Extra penalty based on total high engine detections
        if (detectedCount > 5) {
            score += WEIGHTS.virustotal.engineDetectedHigh;
        } else if (detectedCount > 0) {
            score += WEIGHTS.virustotal.engineDetectedLow;
        }

        score += weightedScore;

        return score;
    }

    private getUrlscanScore(scan: URLScanReportType): number {
        const { lists = {}, page = {}, stats = {}, verdicts = {} } = scan;

        const country = ((page['country'] as string) || '').toUpperCase();
        const visibility = ((page['visibility'] as string) || '').toLowerCase();
        const tags = (verdicts?.overall?.tags || []) as string[];
        const isMalicious = verdicts?.overall?.malicious === true;
        const linkDomains: string[] = lists.linkDomains || [];

        const riskyCountries = ['RU', 'CN', 'KP', 'IR'];
        const riskyVisibilities = ['public', 'unlisted'];

        let score = 0;

        if (isMalicious) score += WEIGHTS.urlscan.maliciousVerdict;
        if (riskyCountries.includes(country)) score += WEIGHTS.urlscan.riskyCountry;
        if (riskyVisibilities.includes(visibility)) score += WEIGHTS.urlscan.riskyVisibility;
        if (tags.includes('secure')) score += WEIGHTS.urlscan.secureBonus;

        // Domain volume penalty
        if (linkDomains.length > 30) {
            score += WEIGHTS.urlscan.manyDomains;
        } else if (linkDomains.length > 15) {
            score += WEIGHTS.urlscan.mediumDomains;
        }

        // Repeated domain penalty
        const domainCounts: Record<string, number> = {};
        linkDomains.forEach((domain) => {
            domainCounts[domain] = (domainCounts[domain] || 0) + 1;
        });

        const repeatedDomains = Object.values(domainCounts).filter((count) => count > 3).length;
        if (repeatedDomains > 0) {
            score += repeatedDomains * WEIGHTS.urlscan.repeatedDomainPenalty;
        }

        // Unique IPs penalty
        if ((stats.ipCount || 0) > 10) {
            score += WEIGHTS.urlscan.ipCountPenalty;
        }

        return score;
    }
}

export default ScoreService;
