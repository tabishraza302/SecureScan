import UserModel from "../../database/models/User.Model";
import ScanModel from "../../database/models/Scan.Model";
import ReportModel from "../../database/models/Report.Model";
import ApiResponseModel from "../../database/models/ApiResponse.Model";
import ReportedWebsiteModel from "../../database/models/ReportedWebsite.Model";

import UrlScanService from "../../services/scanning/externalAPIs/URLScan.Service";
import VirustotalService from "../../services/scanning/externalAPIs/Virustotal.Service";


class AdminService {
    private urlScanService: UrlScanService;
    private virusTotalService: VirustotalService;

    constructor() {
        this.urlScanService = new UrlScanService();
        this.virusTotalService = new VirustotalService();
    }

    async LoadDashboardData() {
        try {
            const totalUsers = await UserModel.findAndCountAll();
            const totalWebsiteScanned = await ScanModel.findAndCountAll();
            const pendingReports = await ReportedWebsiteModel.findAndCountAll({ where: { status: "pending" }});

            return { totalUsers, totalWebsiteScanned, pendingReports };
        } catch(error) {
            console.log(error);        
        }
    }


    async GetAllUsers() {
        try {
            const users = await UserModel.findAll();
            return { users: users[0].dataValues }            
        } catch (error) {
            console.log(error);
        }
    }


    async DeleteUserById(id: string) {
        try {
            await UserModel.destroy({ where: {id}});
            return;
        } catch(error) {
            console.log(error);
        }
    }


    async GetScannedWebsite() {
        try {
            const scannedWebsites = await ScanModel.findAll();
            return scannedWebsites;
        } catch (error) {
            console.log(error);
        }
    }


    async GetWebsiteReportById(id: string) {
        try {
            const reports = await ApiResponseModel.findAll({ where: { id }});
        } catch (error) {
            console.log(error);
        }
    }


    async GetReportedWebsiteList() {
        try {
            const reportedWebsites = await ReportedWebsiteModel.findAll();
            return reportedWebsites;
        } catch (error) {
            console.log(error);
        }       
    }


    async GetReportsById(id: string) {
        try {
            const report = await ReportModel.findAll({where: { website_id: id }});
            return report;
        } catch (error) {
            console.log(error);
        }
    }
}

export default AdminService;