import { Model, UUID, UUIDV4, TEXT, JSON, DATE } from "sequelize";

import Database from "../Database";

// Models
import UserModel from "./User.Model";
import ReportedWebsiteModel from "./ReportedWebsite.Model";

class Report extends Model {}

Report.init(
    {
        id: { 
            type: UUID, 
            primaryKey: true, 
            defaultValue: UUIDV4 
        },
        website_id: { 
            type: UUID, 
            allowNull: false, 
            references: { 
                key: "id", 
                model: ReportedWebsiteModel 
            } 
        },
        reported_by: { 
            type: UUID, 
            allowNull: false, 
            references: { 
                model: UserModel, 
                key: "id" 
            } 
        },
        reason: { 
            type: TEXT, 
            allowNull: false 
        },
    },
    {
        sequelize: Database,
        modelName: "Report",
        tableName: "reports"
    }
);

// Define Associations
ReportedWebsiteModel.hasMany(Report, { foreignKey: "website_id", onDelete: "CASCADE" });
Report.belongsTo(ReportedWebsiteModel, { foreignKey: "website_id" });

UserModel.hasMany(Report, { foreignKey: "reported_by", onDelete: "CASCADE" });
Report.belongsTo(UserModel, { foreignKey: "reported_by" });

export default Report;