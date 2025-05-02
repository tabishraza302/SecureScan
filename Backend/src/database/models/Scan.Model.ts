import { UUIDV4, UUID, STRING, NOW, DATE, ENUM, INTEGER, Model } from "sequelize";

import Database from '../Database';

class Scan extends Model {};

Scan.init(
    {
        id: {
            type: UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: UUIDV4
        },
        domain: {
            type: STRING,
            allowNull: false
        },
        score: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        scan_date: {
            type: DATE,
            allowNull: false,
            defaultValue: NOW
        },
        status: {
            type: ENUM("pending", "completed", "failed"),
            allowNull: false,
            defaultValue: "pending"
        }
    },
    {
        sequelize: Database,
        modelName: "Scan",
        tableName: "scans"
    }
)

export default Scan;