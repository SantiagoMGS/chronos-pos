type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'complete' | 'start';

interface LogOptions {
  level?: LogLevel;
  prefix?: string;
  icon?: string;
}

export class SeedLogger {
  private static colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
  };

  private static getColoredText(text: string, color: keyof typeof SeedLogger.colors): string {
    return `${SeedLogger.colors[color]}${text}${SeedLogger.colors.reset}`;
  }

  private static formatMessage(message: string, options?: LogOptions): string {
    const { level = 'info', prefix = '', icon = '' } = options || {};

    let coloredMessage = message;
    let levelIcon = '';

    switch (level) {
      case 'error':
        coloredMessage = this.getColoredText(message, 'red');
        levelIcon = '❌';
        break;
      case 'success':
        coloredMessage = this.getColoredText(message, 'green');
        levelIcon = '✅';
        break;
      case 'warn':
        coloredMessage = this.getColoredText(message, 'yellow');
        levelIcon = '⚠️';
        break;
      case 'complete':
        coloredMessage = this.getColoredText(message, 'magenta');
        levelIcon = '🎉';
        break;
      case 'start':
        coloredMessage = this.getColoredText(message, 'cyan');
        levelIcon = '🚀';
        break;
      default:
        coloredMessage = this.getColoredText(message, 'blue');
        levelIcon = 'ℹ️';
        break;
    }

    const timestamp = new Date().toISOString().substring(11, 23);
    const prefixText = prefix ? `[${prefix}] ` : '';
    const iconText = icon || levelIcon;

    return `${this.getColoredText(timestamp, 'cyan')} ${iconText} ${prefixText}${coloredMessage}`;
  }

  static info(message: string, icon?: string): void {
    console.log(this.formatMessage(message, { level: 'info', icon }));
  }

  static warn(message: string, icon?: string): void {
    console.log(this.formatMessage(message, { level: 'warn', icon }));
  }

  static error(message: string, icon?: string): void {
    console.log(this.formatMessage(message, { level: 'error', icon }));
  }

  static success(message: string, icon?: string): void {
    console.log(this.formatMessage(message, { level: 'success', icon }));
  }

  static complete(message: string, icon?: string): void {
    console.log(this.formatMessage(message, { level: 'complete', icon }));
  }

  static start(message: string, icon?: string): void {
    console.log(this.formatMessage(message, { level: 'start', icon }));
  }

  static log(message: string, level?: LogLevel, prefix?: string, icon?: string): void {
    console.log(this.formatMessage(message, { level, prefix, icon }));
  }
}
