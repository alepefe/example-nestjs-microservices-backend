export const VERIFICATION_CODE_TYPES = {
  EMAIL: 'email',
  RESET_PASSWORD: 'reset_password'
} as const;

export type VerificationCodeTypeType = typeof VERIFICATION_CODE_TYPES[keyof typeof VERIFICATION_CODE_TYPES]
