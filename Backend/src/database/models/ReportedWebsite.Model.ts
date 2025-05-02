import { Model, UUID, UUIDV4, STRING, ENUM, INTEGER } from "sequelize";

import Database from "../Database";

class ReportedWebsite extends Model {}

ReportedWebsite.init(
    {
        id: {
            type: UUID,
            primaryKey: true,
            defaultValue: UUIDV4,
            allowNull: false
        },
        url: {
            type: STRING(2083),  // Max length for URLs
            allowNull: false,
        },
        report_count: {
            type: INTEGER,
            defaultValue: 1,
            allowNull: false
        },
        status: { 
            type: ENUM("pending", "reviewed", "flagged", "safe"), 
            defaultValue: "pending" 
        }
    },
    {
        sequelize: Database,
        modelName: "ReportedWebsite",
        tableName: "reported_websites"
    }
);

export default ReportedWebsite;
