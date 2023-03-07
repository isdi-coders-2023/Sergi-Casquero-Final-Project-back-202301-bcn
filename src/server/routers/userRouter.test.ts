import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import app from "..";
import { type UserStructure } from "../controllers/userControllers/types.js";
import User from "../../database/models/User/User.js";
import connectDatabase from "../../database/connectDatabase.js";

const mockedUser: UserStructure = {
  username: "sergi",
  email: "sergi@isdi.com",
  password: "p455w0rd",
};

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

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a POST 'user/register' endpoint", () => {
  describe("When it receives a request with username 'sergi', email 'sergi@isdi.com' and password 'p455w0rd'", () => {
    test("Then it should response with status 201 and message 'The user has been created'", async () => {
      const expectedStatus = 201;
      const endpoint = "/user/register";

      const response = await request(app)
        .post(endpoint)
        .send(mockedUser)
        .expect(expectedStatus);
    });
  });
});
