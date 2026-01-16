import * as dotenv from 'dotenv';

import type { TEnvironment } from '@resources';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV as TEnvironment,

  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3000,

  tmdb: {
    token: process.env.TMDB_TOKEN,
    baseUrl: 'https://api.themoviedb.org/3',
  },
};
