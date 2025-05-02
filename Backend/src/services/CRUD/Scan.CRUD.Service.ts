import ErrorHandler from "../../utils/ErrorHandler";
import ScanModel from "../../database/models/Scan.Model";
import ApiResponseModel from "../../database/models/ApiResponse.Model";


class ScanCRUD {
    public async GetScoreByDomain(domain: string) {
        try {
            return await ScanModel.findOne({ where: { domain }, attributes: ["score"] });
        } catch (error) {
            console.log(error);
            throw new ErrorHandler(500, "Failed to get score.");
        }
    }

    public async GetScanSummary(domain: string) {
        try {
            return await ScanModel.findAll({
                where: { domain },
                include: {
                    model: ApiResponseModel,
                    required: true,
                    as: "ApiResponse",
                    attributes: ['api_name', "response"]
                }
            });
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(500, "Failed to fetch data.")
        }
    }


    public async GetFullReport(domain: string) {
        try {
            return await ScanModel.findAll({
                where: { domain },
                attributes: ["score", "domain", "scan_date"],
                include: {
                    model: ApiResponseModel,
                    as: "ApiResponse",
                    attributes: ["api_name", "response",]
                }
            })
        } catch (error) {
            console.log(error);
            throw new ErrorHandler(500, "Failed to get report!")
        }
    }
}


export default ScanCRUD;