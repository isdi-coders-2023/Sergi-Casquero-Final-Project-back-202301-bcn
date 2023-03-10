import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import { generalError, notFoundError } from "./errorMiddlewares";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const req: Partial<Request> = {};
const next = jest.fn() as NextFunction;

beforeEach(() => jest.clearAllMocks());

describe("Given a notFoundError middleware", () => {
  describe("When it receives a request", () => {
    test("Then it should call its next method", () => {
      notFoundError(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a generalError middleware", () => {
  describe("When it receives an error with status 500", () => {
    test("Then it should call its status method with a 500", () => {
      const statusCode = 500;
      const error = new CustomError(
        "There was an error",
        500,
        "Something went wrong"
      );

      generalError(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });
  });

  describe("When it receives an error without statusCode nor publicMessage", () => {
    test("Then it should call its status method with a 500 and its json method with 'Something went wrong'", () => {
      const error = new CustomError("", 0, "");
      const expectedStatusCode = 500;
      const expectedMessage = { error: "Something went wrong" };

      generalError(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
