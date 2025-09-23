import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME || 'securescan_db',
    process.env.DB_USER || 'securescan_user',
    process.env.DB_PASSWORD || 'securescan_password',
    {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        dialect: 'postgres',
        logging: false, // Disable logging for cleaner output
    }
);

export default sequelize;
