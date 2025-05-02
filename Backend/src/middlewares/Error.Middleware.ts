import { Request, Response, NextFunction } from "express";

import ErrorHandler from "../utils/ErrorHandler";
import { error as ErrorResponse } from "../utils/ResponseHelper";

function ErrorMiddleware(error: ErrorHandler, req: Request, res: Response, next: NextFunction) {
    const message = error.message || "Something went wrong.";
    const statusCode = error.statusCode || 500;

    ErrorResponse(res, statusCode, message)
}

export default ErrorMiddleware;