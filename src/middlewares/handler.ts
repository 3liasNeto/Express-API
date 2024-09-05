import winston from "winston";
import { randomBytes } from 'crypto';


const { json, combine, timestamp, printf } = winston.format;
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";
const generateLogId = (): string => randomBytes(16).toString('hex');


const Log = winston.createLogger({
  format: combine(
    timestamp({ format: timestampFormat }),
    json(),
    printf(({ timestamp, level, message, ...data }) => {
      const response = {
        level,
        id: generateLogId(),
        timestamp,
        message,
        data,
      };

      return JSON.stringify(response);
    })
  ),
  transports: [
    new winston.transports.Console({})
  ]
});

export { Log };