import SummaryItem from "./SummaryItem";

interface SummaryTypes {
    maliciousCount: number;
    suspiciousCount: number;
    harmlessCount: number;
    totalLinksCount: number;
}


function Summary({maliciousCount, suspiciousCount, harmlessCount, totalLinksCount}: SummaryTypes) {
    return(
        <div className="summary-container mt-8">
            <div className="summary-items">
                <SummaryItem title="Malicious" count={maliciousCount} />
                <SummaryItem title="Suspicious" count={suspiciousCount} />
            </div>

            <div className="summary-items">
                <SummaryItem title="Harmless" count={harmlessCount} />
                <SummaryItem title="Total Links" count={totalLinksCount} />
            </div>
        </div>
    )
}


export default Summary;