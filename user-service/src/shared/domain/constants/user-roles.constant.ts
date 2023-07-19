export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type UserRoleType = (typeof USER_ROLES)[keyof typeof USER_ROLES];
