import { Injectable, isDevMode } from '@angular/core';

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: unknown;
  source?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdaLogger {
  private logLevel: LogLevel = !isDevMode() ? LogLevel.Warn : LogLevel.Debug;

  debug(message: string, data?: unknown, source?: string): void {
    this.log(LogLevel.Debug, message, data, source);
  }

  info(message: string, data?: unknown, source?: string): void {
    this.log(LogLevel.Info, message, data, source);
  }

  warn(message: string, data?: unknown, source?: string): void {
    this.log(LogLevel.Warn, message, data, source);
  }

  error(message: string, data?: unknown, source?: string): void {
    this.log(LogLevel.Error, message, data, source);
  }

  private log(level: LogLevel, message: string, data?: unknown, source?: string): void {
    if (level >= this.logLevel) {
      const logEntry: LogEntry = {
        timestamp: new Date(),
        level,
        message,
        data,
        source,
      };

      this.writeToConsole(logEntry);

      // You can add additional log handlers here:
      // - Send to backend API
      // - Store in localStorage
      // - Send to external logging service
    }
  }

  private writeToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp.toISOString()}] ${LogLevel[entry.level]}`;
    const sourceInfo = entry.source ? ` (${entry.source})` : '';

    switch (entry.level) {
      case LogLevel.Debug:
        console.debug(`${prefix}${sourceInfo}:`, entry.message, entry.data || '');
        break;
      case LogLevel.Info:
        console.info(`${prefix}${sourceInfo}:`, entry.message, entry.data || '');
        break;
      case LogLevel.Warn:
        console.warn(`${prefix}${sourceInfo}:`, entry.message, entry.data || '');
        break;
      case LogLevel.Error:
        console.error(`${prefix}${sourceInfo}:`, entry.message, entry.data || '');
        break;
    }
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}
