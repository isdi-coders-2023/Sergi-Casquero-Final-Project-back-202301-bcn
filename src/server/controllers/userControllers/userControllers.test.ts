import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../../../database/models/User/User.js";
import { loginUser, registerUser } from "./userControllers.js";
import { type UserCredentials, type UserStructure } from "./types.js";
import CustomError from "../../../CustomError/CustomError.js";
import { type CustomCredentials, type CustomRequest } from "../../../types.js";

const mockedUser: UserStructure = {
  username: "sergi",
  email: "sergi@isdi.com",
  password: "p455w0rd",
};

const mockedCredentials: UserCredentials = {
  email: "sergi@isdi.com",
  password: "p455w0rd",
};

afterEach(async () => {
  jest.clearAllMocks();
});

describe("Given a registerUser controller", () => {
  const req: Partial<Request> = {};

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: Partial<NextFunction> = jest.fn();

  describe("When it receives a request with username 'sergi', email 'sergi@isdi.com' and password 'p455w0rd'", () => {
    test("Then it should call its status method with code 201 and its json method with 'message: sergi account created!'", async () => {
      const expectedStatusCode = 201;
      const expectedBodyResponse = { message: "sergi account created!" };

      req.body = mockedUser;
      bcrypt.hash = jest.fn().mockResolvedValue("asdfasdg3425342dsafsdfg");
      User.create = jest.fn().mockResolvedValue(mockedUser);

      await registerUser(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedBodyResponse);
    });
  });

  describe("When it receives a request with username 'sergi', email 'sergi@isdi.com' and password 'p455' which is invalid", () => {
    test("Then it should call its next method", async () => {
      const mockedInvalidUser = {
        username: "",
        email: "sergi@isdi.com",
        password: "p455",
      };

      const expectedError = new CustomError(
        "Couldn't Create the user",
        500,
        "Couldn't create the user"
      );

      req.body = mockedInvalidUser;
      bcrypt.hash = jest.fn().mockResolvedValue("asdfasdg3425342dsafsdfg");
      User.create = jest.fn().mockRejectedValue(undefined);

      await registerUser(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a loginUser controller", () => {
  const req: Partial<Request> = {};
  req.body = mockedCredentials;

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

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

      await loginUser(req as CustomCredentials, res as Response, next);

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

      await loginUser(req as CustomCredentials, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with username 'sergi' and passwords don't match'", () => {
    test("Then it should call its next method with a status code 401 and a message 'Wrong credentials'", async () => {
      const expectedError = new CustomError(
        "Wrong credentials",
        401,
        "Wrong credentials"
      );

      req.body = mockedUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockedUser,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(req as CustomCredentials, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
