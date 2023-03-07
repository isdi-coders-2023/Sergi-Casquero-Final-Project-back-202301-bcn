import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../../database/models/User/User.js";
import { loginUser, registerUser } from "./userControllers.js";
import connectDatabase from "../../../database/connectDatabase.js";
import { type UserCredentials, type UserStructure } from "./types.js";
import CustomError from "../../../CustomError/CustomError.js";

let server: MongoMemoryServer;

const mockedUser: UserStructure = {
  username: "sergi",
  email: "sergi@isdi.com",
  password: "p455w0rd",
};

const mockedCredentials: UserCredentials = {
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

describe("Given a loginUser controller", () => {
  const req = {} as Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >;
  req.body = mockedCredentials;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const next = jest.fn() as NextFunction;

  describe("When it receives a request with email 'sergi@isdi.com' and password 'p455w0rd' and they are correct", () => {
    test("Then it should call its status method with code 200 and its json method with an object with 'token' property", async () => {
      const expectedStatusCode = 200;
      const expectedBodyResponse = { token: "token" };

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockedCredentials,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("token");

      await loginUser(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedBodyResponse);
    });
  });

  describe("When it receives a request with a username that doesn't exist in the database", () => {
    test("Then it should call its next method with a status code 401 and a message 'Wrong credentials'", async () => {
      const expectedError = new CustomError(
        "User not found",
        401,
        "User not found"
      );

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await loginUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with username 'sergi' and password 'wr0ngP455w0rd'", () => {
    test("Then it should call its next method with a status code 401 and a message 'Wrong credentials'", async () => {
      const expectedError = new CustomError(
        "User not found",
        401,
        "User not found"
      );

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(req, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
