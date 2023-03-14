import { type Request, type Response, type NextFunction } from "express";
import CustomError from "../../../CustomError/CustomError";
import Workout from "../../../database/models/Workout/Workout";
import { type WorkoutsStructure } from "./types";
import { getWorkouts } from "./workoutControllers";

afterAll(() => {
  jest.clearAllMocks();
});

const fullBodyWorkout = {
  id: "269",
  name: "Full Body Workout",
  description: "Targets all major muscle groups",
  difficulty: "Intermediate",
  image: "path/to/image.jpg",
  exercises: ["Bench Press", "Pull-Ups"],
};

const cardioWorkout = {
  id: "27",
  name: "Cardio Workout",
  description: "Great for beginners",
  difficulty: "Beginner",
  image: "path/to/image.jpg",
  exercises: ["Jumping Jacks", "Burpees"],
};

const mockedWorkoutList: WorkoutsStructure = [fullBodyWorkout, cardioWorkout];

describe("Given a getWorkouts controller", () => {
  const req: Partial<Request> = {};
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn() as NextFunction;

  describe("When it receives a request with method GET", () => {
    test("Then it should call its status method with code 200 and its json method with a list of workouts", async () => {
      const expectedStatus = 200;

      Workout.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockedWorkoutList),
      }));

      await getWorkouts(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ workouts: mockedWorkoutList });
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should call its next method", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({}),
      };
      const req: Partial<Request> = {};
      const next = jest.fn();

      const error = new Error("Bad request");

      req.body = {};

      Workout.find = jest.fn().mockImplementationOnce(() => {
        throw new Error("Bad request");
      });

      await getWorkouts(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
