import winston from 'winston';

const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    const metaString =
      metadata && Object.keys(metadata).length ? JSON.stringify(metadata) : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaString}`;
  }
);

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/combined.log',
      level: 'info'
    }),

    new winston.transports.File({
      filename: 'logs/debug.log',
      level: 'debug'
    }),

    // Log error level messages to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    })
  ]
});

export default logger;
