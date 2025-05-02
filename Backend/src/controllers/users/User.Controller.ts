import { Request, Response, NextFunction } from "express";

import ErrorHandler from "../../utils/ErrorHandler";
import { success } from "../../utils/ResponseHelper";
import { AuthenticatedRequest } from "../../types/Types";
import UserService from "../../services/users/User.Service";

interface DashboardRequestBody extends Request{
    user_id: string;
}


class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();

        this.ScanWebsite = this.ScanWebsite.bind(this);
        this.GetDashboard = this.GetDashboard.bind(this);
        this.GetReportsById = this.GetReportsById.bind(this);
        this.GetReportedWebsite = this.GetReportedWebsite.bind(this);
    }

    async GetDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        const { user_id } = req;

        try {
            if(!user_id) 
                throw new ErrorHandler(401, "User not authenticated");

            const data = await this.userService.GetDashboard(user_id);
            if (!data) throw new ErrorHandler(500, "Failed to get dashboard data.");

            const { totalReportedWebsite, totalPendingReports } = data;
            success(res, 200, "Dashboard data fetched", {
                totalReportedWebsite,
                totalPendingReports
            });
        } catch (error) {
            console.error("Error in GetDashboard:", error);
            next(new ErrorHandler(500, "Failed to fetch dashboard data."));
        }
    }

    async GetReportedWebsite(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        const { user_id } = req;

        try {
            if(!user_id) 
                throw new ErrorHandler(401, "User not authenticated");

            const reportedWebsites = await this.userService.GetReportedWebsite(user_id);
            if (!reportedWebsites) throw new ErrorHandler(500, "Failed to get reported websites.");

            success(res, 200, "Reported websites fetched", { reportedWebsites });
        } catch (error) {
            console.error("Error in GetReportedWebsite:", error);
            next(new ErrorHandler(500, "Failed to fetch reported websites."));
        }
    }

    async GetReportsById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        const { user_id } = req;
        const { id } = req.query;

        if (typeof id !== "string") {
            console.warn("Invalid or missing report ID in GetReportsById");
            throw new ErrorHandler(400, "Invalid or missing report ID");
        }

        try {
            const report = await this.userService.GetReportsById(id);
            success(res, 200, "Report fetched", { report });
        } catch (error) {
            console.error("Error in GetReportsById:", error);
            next(new ErrorHandler(500, "Failed to fetch report."));
        }
    }

    async ScanWebsite(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        const { user_id } = req;
        const { url } = req.body;

        if (!url || typeof url !== "string") {
            console.warn("Invalid or missing URL in ScanWebsite");
            throw new ErrorHandler(400, "Invalid or missing URL");
        }

        try {
            const scanResult = await this.userService.ScanWebsite(url);
            success(res, 200, "Website scanned", { scanResult });
        } catch (error) {
            console.error("Error in ScanWebsite:", error);
            next(new ErrorHandler(500, "Failed to scan website."));
        }
    }
}

export default UserController;
