import { Response } from "express";

function success(res: Response, statusCode: number = 200, message: string = "success", data: any = null) {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    })
}


function error(res: Response, statusCode: number = 500, message: string = "Something went wrong.") {
    return res.status(statusCode).json({
        success: false,
        message
    })
}


export { success, error };