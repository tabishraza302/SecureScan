interface VirustotalHeaderTypes {
    [key: string]: string;
    "x-apikey": string;
}

interface ScanResponseTypes {
    [key: string]: any;
}

interface EncodedParamsType {
    [key: string]: string
}

interface VirusTotalResultItem {
    result: "clean" | "unrated" | string;
  };
  

export {
    EncodedParamsType,
    ScanResponseTypes,
    VirustotalHeaderTypes,
    VirusTotalResultItem
}