import { defineCliConfig } from 'sanity/cli';
import path from 'path';

export default defineCliConfig({
  api: {
    projectId: '5mog5ask',
    dataset: 'development',
  },
  vite: (config) => {
    return {
      ...config,
      resolve: {
        alias: {
          '@corona-dashboard/common': path.resolve(__dirname, '../common/src'),
          '@corona-dashboard/app': path.resolve(__dirname, '../app/src'),
          '@corona-dashboard/icons': path.resolve(__dirname, '../icons/src'),
        },
      },
      build: {
        ...config.build,
        target: 'esnext',
      },
    };
  },
});
