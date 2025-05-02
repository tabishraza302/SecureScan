const SkipURLPatterns = [
    "localhost", 
    "127.0.0.1", 
    "*.local", 
    "*.dev", 
    "*.test", 
    "*.mock", 
    "*.example.com", 
    "*.invalid", 
    "*.localhost", 
    "*.onion", 
    "www.virustotal.com",
    "virustotal.com",
    "*.virustotal.com", 
    "urlscan.io", 
    "*.urlscan.io",
    
    // Browser internal URLs
    /^chrome:\/\/.*$/,       // Chrome internal URLs (settings, extensions, etc.)
    /^edge:\/\/.*$/,         // Edge internal URLs (settings, extensions, etc.)
    /^opera:\/\/.*$/,        // Opera internal URLs (settings, extensions, etc.)
    /^about:.*$/,            // Firefox internal URLs (preferences, config, etc.)
    
    // Browser-specific internal pages (full match, no wildcard needed)
    "settings",    // Chrome settings page
    "extensions",  // Chrome extensions page
    "history",     // Chrome history page
    "downloads",   // Chrome downloads page
    "flags",       // Chrome flags (experimental features)
    "bookmarks",   // Chrome bookmarks page
    "about",       // Chrome about page
    "newtab",      // Chrome new tab page
    "preferences",     // Firefox settings page
    "addons",          // Firefox add-ons page
    "config",          // Firefox advanced configuration
    "blank",           // Firefox blank page
  
    // Extension-related URLs (for all browsers)
    /^moz-extension:\/\//,   // Firefox extension URLs
    /^chrome-extension:\/\//, // Chrome extension URLs
    /^edge-extension:\/\//,   // Edge extension URLs
    /^opera-extension:\/\//,  // Opera extension URLs
    
    // Internal file system and data URLs
    /^file:\/\//,            // Local file system URLs
    /^data:.*$/,             // Data URLs (e.g., inline resources)
    /^blob:.*$/,             // Blob URLs (e.g., temporary data)
    
    // Reserved domains and testing
    "example.com",           // Example domain (reserved)
    "test.com",              // Test domain
    "demo.com",              // Demo domain
    "dev.local",             // Local development domain
    /^staging\..*\..*/,      // Staging domains (regex pattern to capture subdomains)
    /^test\..*\..*/,         // Test domains (regex pattern to capture subdomains)
    /^mock\..*\..*/,         // Mock domains (regex pattern to capture subdomains)
    
    // Additional patterns
    /^chrome:\/\/.*$/,       // Any Chrome internal page (settings, extensions, etc.)
    /^edge:\/\/.*$/,         // Any Edge internal page (settings, extensions, etc.)
    /^opera:\/\/.*$/,        // Any Opera internal page (settings, extensions, etc.)
    /^about:.*$/,            // Any Firefox internal page (preferences, add-ons, etc.)
    "google.com", "www.google.com", "*.google.com", "*.facebook.com", "facebook.com", "meta.com", "*.meta.com"
  ];

function shouldSkipURL(url: string) {
    return SkipURLPatterns.some(pattern => typeof pattern === "string" ? url.includes(pattern) : pattern.test(url));
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "SCAN_URL") {
        const { url } = message.payload;

        const skip = shouldSkipURL(url);
        if(skip)  {
            sendResponse({ error: true, message: "Url is skipped"})
            return;
        }

        const urlHostname = new URL(url).hostname;
  
        (async () => {
            try {
                const res = await fetch(`http://localhost:3000/browser-extension/scan/${urlHostname}`, { method: "POST",});
                const data = await res.json();
    
                sendResponse({data});
            } catch (err) {
                console.error("❌ Error scanning URL:", err);
                sendResponse({error: true, message: err,});
            }
        })();
  
        return true; // IMPORTANT to keep the message channel open
    }
});
  