import { Request, Response, NextFunction } from "express";
import AdminService from "../../services/users/Admin.Services";
import { success } from "../../utils/ResponseHelper";
import ErrorHandler from "../../utils/ErrorHandler";

class AdminController {
    private adminService: AdminService;

    constructor() {
        this.adminService = new AdminService();

        this.GetUsersList = this.GetUsersList.bind(this);
        this.DeleteUserById = this.DeleteUserById.bind(this);
        this.GetReportsById = this.GetReportsById.bind(this);
        this.GetDashboardData = this.GetDashboardData.bind(this);
        this.GetReportedWebsite = this.GetReportedWebsite.bind(this);
        this.GetWebsiteReportById = this.GetWebsiteReportById.bind(this);
        this.GetScannedWebsitesList = this.GetScannedWebsitesList.bind(this);
    }

    async GetDashboardData(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const data = await this.adminService.LoadDashboardData();
            if (!data) throw new ErrorHandler(500, "Failed to fetch data.");
            return success(res, 200, "Dashboard data fetched", data);
        } catch (error) {
            console.error("Error in GetDashboardData:", error);
            return next(error);
        }
    }

    async GetUsersList(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const users = await this.adminService.GetAllUsers();
            if (!users) throw new ErrorHandler(500, "Failed to get users list.");
            success(res, 200, "Users list fetched", { users });
        } catch (error) {
            console.error("Error in GetUsersList:", error);
            return next(error);
        }
    }

    async DeleteUserById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<any> {
        const { id } = req.params;
        try {
            await this.adminService.DeleteUserById(id);
            success(res, 200, "User deleted");
        } catch (error) {
            console.error("Error in DeleteUserById:", error);
            next(new ErrorHandler(500, "Failed to delete user"));
        }
    }

    async GetScannedWebsitesList(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const scannedWebsites = await this.adminService.GetScannedWebsite();
            success(res, 200, "Scanned websites fetched", { scannedWebsites });
        } catch (error) {
            console.error("Error in GetScannedWebsitesList:", error);
            next(new ErrorHandler(500, "Failed to fetch scanned website list."));
        }
    }

    async GetWebsiteReportById(req: Request, res: Response, next: NextFunction): Promise<any> {
        const idParam = req.query.id;
        if (typeof idParam !== "string") {
            console.warn("Invalid or missing report ID in GetWebsiteReportById");
            throw new ErrorHandler(400, "Invalid or missing report ID")
        }

        try {
            const reports = await this.adminService.GetWebsiteReportById(idParam);
            success(res, 200, "Website report fetched", { reports });
        } catch (error) {
            console.error("Error in GetWebsiteReportById:", error);
            next(new ErrorHandler(500, "Failed to fetch report"));
        }
    }

    async GetReportedWebsite(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const reportedWebsites = await this.adminService.GetReportedWebsiteList();
            success(res, 200, "Reported websites fetched", { reportedWebsites });
        } catch (error) {
            console.error("Error in GetReportedWebsite:", error);
            next(new ErrorHandler(500, "Failed to fetch reported websites."));
        }
    }

    async GetReportsById(req: Request, res: Response, next: NextFunction): Promise<any> {
        const idParam = req.query.id;
        if (typeof idParam !== "string") {
            console.warn("Invalid or missing report ID in GetReportsById");
            throw new ErrorHandler(400, "Invalid or missing report ID")
        }

        try {
            const report = await this.adminService.GetReportsById(idParam);
            success(res, 200, "Report fetched", { report });
        } catch (error) {
            console.error("Error in GetReportsById:", error);
            next(new ErrorHandler(500, "Failed to get report."));
        }
    }
}

export default AdminController;