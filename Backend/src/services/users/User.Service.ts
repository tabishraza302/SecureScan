import ReportModel from "../../database/models/Report.Model";
import ReportedWebsiteModel from "../../database/models/ReportedWebsite.Model";



import { GetDashboardTypes } from "../../types/User.Types";


class UserService {
    constructor() {
    }


    async GetDashboard(user_id: string): Promise<GetDashboardTypes | undefined> {
        try {
            const totalReportedWebsite = await ReportModel.count({ where: { reported_by: user_id } });
            const totalPendingReports = await ReportedWebsiteModel.count({
                where: { status: "pending" },
                include: [
                    {
                        model: ReportModel,
                        where: { reported_by: user_id },
                        required: true
                    }
                ]
            });

            return { totalReportedWebsite, totalPendingReports };
        } catch (error) {
            console.log(error);
        }
    }


    async GetReportedWebsite(user_id: string) {
        try {
            const reportedWebsites = await ReportModel.findAll({
                where: { reported_by: user_id },
                include: [{
                        model: ReportedWebsiteModel,
                        attributes: ['id', 'url'],
                    }]});

            return { reportedWebsites };
        } catch (error) {
            console.log(error);
        }
    }

    async GetReportsById(user_id: string) {
        try {
        
        } catch (error) {
            console.log(error);
        }
    }


    async ScanWebsite(user_id: string) {
        try {
        } catch (error) {
            console.log(error)
        }
    }
}

export default UserService;