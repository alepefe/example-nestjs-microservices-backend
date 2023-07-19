export interface RegisterUserDTO {
  authStrategy: string;
  email?: string;
  password?: string;
  idToken?: string;
  name: string;
  surname: string;
  fcmToken?: string;
}
