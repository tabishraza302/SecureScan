import { createLogger, format, transports, addColors } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { customLevels, LOG_LEVEL } from './Logger.config';

const { combine, timestamp, printf, colorize, errors, json } = format;

addColors(customLevels.colors);

const devFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const Logger = createLogger({
    levels: customLevels.levels,
    level: LOG_LEVEL,
    format: combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            filename: 'logs/%DATE%-error.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d',
        }),
        new DailyRotateFile({
            filename: 'logs/%DATE%-combined.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
    ],
    exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
});

process.on('unhandledRejection', (err: unknown) => {
    console.error('Unhandled Rejection: ' + (err instanceof Error ? err.message : String(err)));
});


export default Logger;