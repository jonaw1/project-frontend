import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import dotenv from 'dotenv';

dotenv.config();

const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    const metaString =
      metadata && Object.keys(metadata).length ? JSON.stringify(metadata) : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaString}`;
  }
);

type TransportInstance =
  | winston.transports.ConsoleTransportInstance
  | DailyRotateFile;

const transports: TransportInstance[] = [
  new DailyRotateFile({
    dirname: 'logs/%DATE%',
    filename: '%DATE%-combined.log',
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d'
  }),

  new DailyRotateFile({
    dirname: 'logs/%DATE%',
    filename: '%DATE%-debug.log',
    level: 'debug',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d'
  }),

  new DailyRotateFile({
    dirname: 'logs/%DATE%',
    filename: '%DATE%-error.log',
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d'
  })
];

if (process.env.STAGE == 'development') {
  transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports
});

export default logger;
