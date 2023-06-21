export const initialiseEnvironmentVariables = async () => (await import('dotenv-flow')).config();
