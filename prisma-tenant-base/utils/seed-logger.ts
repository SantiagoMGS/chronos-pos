import { Logger } from '@nestjs/common';

export class SeedLogger {
  private static logger = new Logger('Seed');

  static info(message: string, emoji?: string): void {
    const formattedMessage = emoji ? `${emoji} ${message}` : message;
    this.logger.log(formattedMessage);
  }

  static success(message: string, emoji?: string): void {
    const formattedMessage = `${emoji || '✅'} ${message}`;
    this.logger.log(formattedMessage);
  }

  static error(message: string, emoji?: string): void {
    const formattedMessage = `${emoji || '❌'} ${message}`;
    this.logger.error(formattedMessage);
  }

  static warn(message: string, emoji?: string): void {
    const formattedMessage = `${emoji || '⚠️'} ${message}`;
    this.logger.warn(formattedMessage);
  }

  static start(message: string): void {
    this.logger.log(`🌱 ${message}`);
  }

  static complete(message: string): void {
    this.logger.log(`🎉 ${message}`);
  }
}
