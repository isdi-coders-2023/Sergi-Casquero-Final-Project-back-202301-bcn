import request from "supertest";
import { type Request, type Response } from "express";
import User from "../../../database/models/User/User.js";
import { registerUser } from "./userControllers";
import mongoose from "mongoose";
import app from "../../index.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type UserStructure } from "./types";

let server: MongoMemoryServer;

const mockedUser: UserStructure = {
  username: "sergi",
  email: "sergi@isdi.com",
  password: "p455w0rd",
};

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany(mockedUser);
});

describe("Given a registerUser controller", () => {
  describe("When it receives a request with username 'sergi', email 'sergi@isdi.com' and password 'p455w0rd'", () => {
    test("Then it should call its status method with code 201 and its json method with 'message: sergi account created!'", async () => {
      const req = {} as Request<
        Record<string, unknown>,
        Record<string, unknown>,
        UserStructure
      >;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = () => ({});

      const expectedStatusCode = 201;
      const expectedBodyResponse = { message: "sergi account created!" };

      req.body = mockedUser;
      bcrypt.hash = jest.fn().mockResolvedValue("asdfasdg3425342dsafsdfg");
      User.create = jest.fn().mockResolvedValue(mockedUser);

      await registerUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedBodyResponse);
    });
  });
});
