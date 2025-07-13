import winston from 'winston';
import path from 'path';
import fs from 'fs';

class Logger {
  private logger: winston.Logger;

  constructor() {
    // Create logs directory if it doesn't exist
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'wdio-automation' },
      transports: [
        // Write all logs with importance level of 'error' or less to 'error.log'
        new winston.transports.File({ 
          filename: path.join(logDir, 'error.log'), 
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        // Write all logs with importance level of 'info' or less to 'combined.log'
        new winston.transports.File({ 
          filename: path.join(logDir, 'combined.log'),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        // Write all logs to console with colors
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, stack }) => {
              return `${timestamp} [${level}]: ${message}${stack ? '\n' + stack : ''}`;
            })
          )
        })
      ]
    });
  }

  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error | any) {
    this.logger.error(message, error);
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  verbose(message: string, meta?: any) {
    this.logger.verbose(message, meta);
  }

  // Test specific methods
  logTestStart(testName: string) {
    this.info(`-->Starting test: ${testName}`);
  }

  logTestEnd(testName: string, status: 'PASSED' | 'FAILED') {
    const emoji = status === 'PASSED' ? '**SUCCESS**' : '==FAILURE==';
    this.info(`${emoji} Test ${status}: ${testName}`);
  }

  logTestStep(stepName: string, details?: any) {
    this.info(`-->Step: ${stepName}`, details);
  }

  logTestData(dataName: string, data: any) {
    this.info(`-->Test Data - ${dataName}:`, data);
  }

  logApiCall(method: string, url: string, response?: any) {
    this.info(`-->API Call: ${method} ${url}`, response);
  }

  logDatabaseQuery(query: string, params?: any) {
    this.info(`-->Database Query: ${query}`, params);
  }

  logPageAction(action: string, element: string, value?: string) {
    const valueText = value ? ` with value: ${value}` : '';
    this.info(`-->Page Action: ${action} on ${element}${valueText}`);
  }

  logSuccess(message: string, meta?: any) {
    this.info(`-->SUCCESS: ${message}`, meta);
  }

  logFailure(message: string, meta?: any) {
    this.error(`-->FAILURE: ${message}`, meta);
  }
}

export default new Logger();