import { useEffect, useState } from "react";
import Data from "./components/Data/Data";
import Loading from "./components/Loading/Loading";
import Error from "./components/Error/Error";

function App() {
    const [domainName, setDomainName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({
        score: 0,
        maliciousCount: 0,
        suspiciousCount: 0,
        harmlessCount: 0,
        totalLinksCount: 0
    });
    const [skip, setSkip] = useState(false);    

    const MAX_ATTEMPTS = 10;
    const RETRY_DELAY = 4000;


    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getActiveTabURL(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!chrome?.tabs) return reject("chrome.tabs is not available");

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
                const tab = tabs?.[0];
                if (!tab?.url) return reject("No URL found for active tab");
                const url = new URL(tab.url);
                setDomainName(url.hostname);
                resolve(url.hostname);
            });
        });
    }



    useEffect(() => {
        setIsLoading(true);

        const SkipURLPatterns = [
            // Localhost and development domains
            "localhost", "127.0.0.1", "*.local", "*.dev", "*.test", "*.mock", "*.example.com", "*.invalid", "*.localhost", "*.onion", "virustotal.com", "*.virustotal.com", "urlscan.io", "*.urlscan.io",
            /^chrome:\/\/.*$/, /^edge:\/\/.*$/, /^opera:\/\/.*$/, /^about:.*$/,
            "settings", "extensions", "history", "downloads", "flags", "bookmarks", "about", "newtab", "preferences", "addons", "config", "blank",
            /^moz-extension:\/\//, /^chrome-extension:\/\//, /^edge-extension:\/\//, /^opera-extension:\/\//,
            /^file:\/\//, /^data:.*$/, /^blob:.*$/,
            "example.com", "test.com", "demo.com", "dev.local", /^staging\..*\..*/, /^test\..*\..*/, /^mock\..*\..*/,
            "google.com", "*.google.com", "*.facebook.com", "facebook.com", "meta.com", "*.meta.com"
        ];

        const shouldSkipURL = (url: string) => {
            return SkipURLPatterns.some(pattern => typeof pattern === "string" ? url.includes(pattern) : pattern.test(url));
        };

        async function getSummary(hostname: string) {
            try {
                const res = await fetch(`http://localhost:3000/browser-extension/score/${hostname}`);
                const responseData = await res.json();
        
                return responseData.data;
            } catch (err) {
                console.error("Error fetching score:", err);
                return;
            }
        }
    
        async function getScoreWithRetry(hostname: string) {
            let dataReceived = await getSummary(hostname);
        
            if (dataReceived === undefined) {
                for (let i = 0; i < MAX_ATTEMPTS; i++) {
                    await sleep(RETRY_DELAY);
                    dataReceived = await getSummary(hostname);
                    if (dataReceived !== undefined) break;
                }
            }
        
            if (dataReceived !== undefined) {
                return setData(() => dataReceived);
            }
        }    

        (async () => {
            try {
                const url = await getActiveTabURL();
                const shouldSkip = shouldSkipURL(url);
                setSkip(shouldSkip)

                if(shouldSkip) {
                    setIsLoading(false)
                    return; 
                }

                await getScoreWithRetry(url);
            } catch (error) {
                console.error("Error getting active tab URL:", error);
            } finally {
                setIsLoading(false); // ensure loading ends even if error happens
            }
        })();
    }, []);

    return (
        <>
            {isLoading ? <Loading /> : skip? <Error />: <Data 
                score={data.score} 
                maliciousCount={data.maliciousCount}
                suspiciousCount={data.suspiciousCount}
                harmlessCount={data.harmlessCount}
                totalLinksCount={data.totalLinksCount}
                domainName={domainName}
                />}
        </>
    );
}

export default App;
