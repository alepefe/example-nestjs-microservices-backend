export interface AuthenticateUserDTO {
  authStrategy: string;
  email?: string;
  password?: string;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  fcmToken?: string;
}
