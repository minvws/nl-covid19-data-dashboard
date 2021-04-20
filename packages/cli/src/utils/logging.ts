import chalk from 'chalk';

export const logSuccess = (...args: unknown[]) =>
  console.log(chalk.greenBright(...args));
export const logError = (...args: unknown[]) =>
  console.error(chalk.red(...args));
