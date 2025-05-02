interface ScanResponseTypes {
    api: string;
    [key: string]: any;
}
  
interface UrlScanResultTypes {
    [key: string]: any;
}

interface UrlscanScanDataTypes {
    url: string;
    visibility: string;
}

interface UrlscanScanHeaderTypes {
    "API-Key": string | undefined;
    "Content-Type": string;
    [key: string]: any;
}


export {
    ScanResponseTypes,
    UrlScanResultTypes,
    UrlscanScanDataTypes,
    UrlscanScanHeaderTypes
};