import { Model, UUID, UUIDV4, ENUM, INTEGER, JSON, STRING } from "sequelize";

import Database from "../Database";

class User extends Model {};

User.init(
    {
        id: {
            type: UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: UUIDV4
        },
        first_name: {
            type: STRING(20),
            allowNull: false,
        },
        last_name: {
            type: STRING(20),
            allowNull: false
        },
        email: {
            type: STRING(100),
            allowNull: false
        },
        password: {
            type: STRING(250),
            allowNull: false
        },
        role: {
            type: ENUM("admin", "user"),
            allowNull: false,
            defaultValue: "user"
        },
        status: {
            type: ENUM("active", "suspended", "banned"),
            allowNull: false,
            defaultValue: "active"
        },
        report_count: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        trusted_website: {
            type: JSON,
            allowNull: true
        },
        blacklisted_website: {
            type: JSON,
            allowNull: true
        },
    },
    {
        sequelize: Database,
        modelName: "User",
        tableName: "users" 
    }
);

export default User;