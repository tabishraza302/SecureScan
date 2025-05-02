let lastUrl = location.href;
const observer = new MutationObserver(() => {
    const url = location.href;

    if (url !== lastUrl) {
        lastUrl = url;
        handleUrlChange(url);
    }
});
  
function handleUrlChange(url: string) {
    scanDomain(url);
}

observer.observe(document, { subtree: true, childList: true });

function scanDomain(url: string) {
    let scanUrl = location.href;

    if(url)
        scanUrl = url;
    
    chrome.runtime.sendMessage(
        {
            type: "SCAN_URL",
            payload: { url: scanUrl }
        },
        (response) => {
            if (chrome.runtime.lastError) {
                console.error("Message failed:", chrome.runtime.lastError.message);
                return;
            }

            const score = response.data.data.score;
            console.log(score)
            if((score <= 70) && (score > 30)) {
                alert("This website is detected as suspicious!");
            }
            if((score <= 30) && (score >= 0)){
                alert("This website is detected as malicious!");
            }

            return;
        }
    );
}

scanDomain(location.href)