export interface UserStructure {
  username: string;
  email: string;
  password: string;
}

export type UserCredentials = Pick<UserStructure, "email" | "password">;

import { type JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
  username: string;
  sub: string;
}
