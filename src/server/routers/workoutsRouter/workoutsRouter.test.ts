import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import app from "../..";

import connectDatabase from "../../../database/connectDatabase.js";

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongoServerUrl = mongodbServer.getUri();

  await connectDatabase(mongoServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

describe("Given a GET '/workouts' endpoint", () => {
  describe("When it receives a request with GET method", () => {
    test("Then it should call its status method with code 200 and its json method with a list of workouts", async () => {
      const expectedStatus = 200;
      const endpoint = "/workouts";

      const response = await request(app).get(endpoint).expect(expectedStatus);
    });
  });
});
