export interface UserStructure {
  username: string;
  email: string;
  password: string;
}

export type UserCredentials = Pick<UserStructure, "email" | "password">;
