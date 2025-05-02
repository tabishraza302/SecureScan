import { Sequelize } from "sequelize";

const sequelize = new Sequelize('secure_scan', 'root', '', {
        host: 'localhost',
        dialect: 'mysql',
        logging: false, // Disable logging for cleaner output
});

export default sequelize;