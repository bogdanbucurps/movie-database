export const EEnvironment = {
  LOCAL: 'local',
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
} as const;

export type TEnvironment = (typeof EEnvironment)[keyof typeof EEnvironment];
