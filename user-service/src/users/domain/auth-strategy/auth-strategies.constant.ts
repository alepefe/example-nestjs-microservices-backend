export const AUTH_STRATEGIES = {
  LOCAL: 'local',
  REFRESH_TOKEN: 'refresh_token',
  GOOGLE_ID_TOKEN: 'google_id_token',
  GOOGLE_ACCESS_TOKEN: 'google_access_token',
} as const;

export type AuthStrategyType =
  (typeof AUTH_STRATEGIES)[keyof typeof AUTH_STRATEGIES];
