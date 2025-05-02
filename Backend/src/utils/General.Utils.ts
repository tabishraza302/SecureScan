import { RequestBodyType } from "../types/General.Types";

function isBodyEmpty(body: RequestBodyType): boolean {
    return body && Object.keys(body).length === 0;
}


export  { isBodyEmpty };