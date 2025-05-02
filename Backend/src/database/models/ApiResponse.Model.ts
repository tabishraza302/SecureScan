import { Model, UUID, UUIDV4, STRING, NOW, DATE, JSON } from "sequelize";

import Database from "../Database";
import ScanModel from "./Scan.Model";

class ApiResponse extends Model {};

ApiResponse.init(
    {
        id: {
            type: UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: UUIDV4
        },
        scan_id: {
            type: UUID,
            allowNull: false,
            references: {
                key: "id",
                model: ScanModel
            },
            onDelete: "CASCADE"
        },
        api_name: {
            type: STRING(50),
            allowNull: false
        },
        response: {
            type: JSON,
            allowNull: false,
        },
        received_at: {
            type: DATE,
            allowNull: false,
            defaultValue: NOW
        }
    },
    {
        sequelize: Database,
        modelName: "ApiResponse",
        tableName: "api_responses"
    }
);

ScanModel.hasMany(ApiResponse, { foreignKey: "scan_id", onDelete: "CASCADE", as: "ApiResponse"});
ApiResponse.belongsTo(ScanModel, {foreignKey: "scan_id"});

export default ApiResponse;