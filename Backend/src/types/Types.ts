import { Request } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export interface RegisterDTO {
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string, 
    confirmPassword: string
}
  
export interface LoginDTO {
    email: string;
    password: string;
}
  
export interface AuthenticatedRequest extends Request {
    user_id?: string;
    user_email?: string;
    user_role?: string;
}

export interface JWTDecodedData {
    id: string,
    email: string,
    role: string
}

export interface RegisterBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}


// URLSCAN_interfaces
export interface URLScanScanResponseType {
    message: string,
    uuid: string,
    result: string,
    api: string,
    visibility: string,
    options: {[key: string]: string},
    url: string,
    country: string
}

export interface URLScanReportType {
    lists: {
        domains?: string[];
        servers?: string[];
        urls?: string[];
        linkDomains?: string[];
    };
    page: {
        [key: string]: string | number;
    };
    stats: {
        [key: string]: number;
    };
    verdicts: {
        [key: string]: {
            [key: string]: string[] | boolean | number;
        };
    };
}


// Virustotal Interfaces
export type VirustotalHeadersType = Record<string, string>;

export interface VirustotalReportType {
    stats: {
        malicious: number;
        suspicious: number;
        undetected: number;
        harmless: number;
        timeout: number;
    };

    antivirusResults: Record<string, {
        method?: string;
        category?: string;
        engine_name?: string;
        result?: string | null;
    }>;
}