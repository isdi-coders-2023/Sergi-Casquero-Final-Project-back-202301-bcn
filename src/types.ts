import { type Request } from "express";
import {
  type UserCredentials,
  type UserStructure,
} from "./server/controllers/userControllers/types";

export type CustomRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserStructure
>;

export type CustomCredentials = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserCredentials
>;
