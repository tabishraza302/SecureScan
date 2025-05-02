import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import "./FullReport.scss";
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const colors  = {
    safe: "#22c55e",
    suspicious: "#facc15",
    malicious: "#ef4444",
} as const;


function FullReport() {
    const { domain } = useParams();
    const [scoreCount, setScore] = useState();
    const [scanDate, setScanDate] = useState("");
    const [status, setStatus] = useState("safe");
    const [scannedDomainName, setScanDomain] = useState("");
    const [summaryData, setSummaryData] = useState({
        harmlessCount: 64,
        maliciousCount: 4,
        suspiciousCount: 0,
        timeoutCount: 0,
        totalLinksCount: 4,
        undetectedCount: 29
    });
    const [engineReports1, setEngineReport1] = useState({});
    const [engineReports2, setEngineReport2] = useState({});
    const [externalLinksData, setExternalLinks] = useState([]); 

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:3000/web/report/${domain}`, { method: "GET" })
                const data = await response.json();
                const { score, scannedDomain, scan_date, summary, engineReports, externalLinks } = data.data;

                const entries = Object.entries(engineReports);
                const mid = Math.ceil(entries.length / 2);
                const engineReports1 = Object.fromEntries(entries.slice(0, mid));
                const engineReports2 = Object.fromEntries(entries.slice(mid));

                const scannedDate = new Date(scan_date);
                const formattedDate = `${scannedDate.getDay()}/${scannedDate.getMonth()}/${scannedDate.getFullYear()}`; 

                if(score> 70 && score < 100) {
                    setStatus("safe")
                }
                if(score > 30  && score< 71) {
                    setStatus("suspicious")
                }
                if(score >= 0 && score < 31) {
                    setStatus("malicious")
                }

                setScore(score)
                setSummaryData(summary)
                setScanDate(formattedDate)
                setScanDomain(scannedDomain)
                setEngineReport1(engineReports1)
                setEngineReport2(engineReports2)
                setExternalLinks(externalLinks)

            } catch (error) {
                console.log(error)
            }
        })()
    }, [domain])

    function LoadAntivirus1() {
        return Object.entries(engineReports1 as Record<string, string>).map(([engine, result]) => (
            <TableRow key={engine}>
                <TableCell className="font-medium antivirus__name">{engine}</TableCell>
                <TableCell className="font-medium text-right antivirus__result" style={{color: result === "malicious"? colors["malicious"]: result==="phishing"? colors["suspicious"]: ""}}>{result}</TableCell>
            </TableRow>
        ));
    }

    function LoadAntivirus2() {
        return Object.entries(engineReports2 as Record<string, string>).map(([engine, result]) => (
            <TableRow key={engine}>
                <TableCell className="font-medium antivirus__name">{engine}</TableCell>
                <TableCell className="font-medium text-right antivirus__result" style={{color: result === "malicious"? colors["malicious"]: result==="phishing"? colors["suspicious"]: ""}}>{result}</TableCell>
            </TableRow>
        ));
    }



    return (
        <div className="container mx-auto px-20 pt-15 pb-12">
            <Card className="header py-10 px-10 mb-10">
                <div className=" header__score" style={{borderColor: colors[status as keyof typeof colors]}}>{scoreCount}/100</div>
                <div className="header__details">
                    <ul>
                        <li className="header__details--domain">
                            https://{scannedDomainName}/...
                        </li>
                        <li className="header__details--status text-muted">Status:
                            <span className='header__details--status-indicator' style={{ color: colors[status as keyof typeof colors]}}>{status}</span></li>
                        <li className="header__details--date text-muted">Scan Date: {scanDate}</li>
                    </ul>
                </div>
            </Card>

            <Card>
                <Tabs defaultValue="summary" className="w-[100%]">
                    <CardHeader className="mb-5 details__card--header">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="summary">Summary</TabsTrigger>
                            <TabsTrigger value="antivirus">Antivirus</TabsTrigger>
                            <TabsTrigger value="links">Links</TabsTrigger>
                        </TabsList>
                    </CardHeader>

                    <CardContent className='details__card--tabs'>
                        <TabsContent value="summary" className='details__tabs--overview'>
                            <ul>
                                <li>Malicious: {summaryData.maliciousCount}</li>
                                <li>Suspicious: {summaryData.suspiciousCount}</li>
                            </ul>
                            <ul>
                                <li>Harmless: {summaryData.harmlessCount}</li>
                                <li>Timeout: {summaryData.timeoutCount} </li>
                            </ul>
                            <ul>
                                <li>Undetected: {summaryData.undetectedCount}</li>
                                <li>External Link: {summaryData.totalLinksCount}</li>
                            </ul>
                        </TabsContent>

                        <TabsContent value="antivirus">
                            <div className="details__tabs--table-container">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100%]">Name</TableHead>
                                            <TableHead className="text-right">Result</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {<LoadAntivirus1 />}
                                    </TableBody>
                                </Table>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100%]">Name</TableHead>
                                            <TableHead className="text-right">Result</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <LoadAntivirus2 />
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="links">
                            <div className="details__tabs-- pl-[2rem] pt-[1rem]">
                                <ul>
                                    {externalLinksData.map((link) => (
                                        <li>{link}</li>
                                    ))}
                                </ul>
                            </div>
                        </TabsContent>
                    </CardContent>
                </Tabs>
            </Card>

        </div>
    );
}


export default FullReport;