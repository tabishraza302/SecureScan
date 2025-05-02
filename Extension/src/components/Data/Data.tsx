import { ChevronRight } from "lucide-react";

import ScoreChart from "../RadialChart/Chat";
import Summary from "../Summary/Summary";
import { Button } from "../ui/button";

interface ResultDataTypes {
    score: number;
    maliciousCount: number;
    suspiciousCount: number;
    harmlessCount: number;
    totalLinksCount: number;
    domainName: string
}


function Data({ score, maliciousCount, suspiciousCount, harmlessCount, totalLinksCount, domainName }: ResultDataTypes) {
    function handleButtonClick() {
        const url = `http://localhost:5173/full-report/${domainName}`;
        // Open the URL in a new tab
        chrome.tabs.create({ url });
    };

    return (
        <div className="data-container">
            <ScoreChart score={score} />
            <Summary maliciousCount={maliciousCount} suspiciousCount={suspiciousCount} harmlessCount={harmlessCount} totalLinksCount={totalLinksCount} />

            <Button variant="secondary" className="mt-8" onClick={handleButtonClick}>
                Full Report
                <ChevronRight />
            </Button>
        </div>
    )
}


export default Data;