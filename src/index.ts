import "./loadEnvironment.js";
import startServer from "./server/startServer.js";
import createDebug from "debug";
import connectDatabase from "./database/connectDatabase.js";

export const debug = createDebug("rockfit:server");

const port = process.env.PORT ?? 5000;
const mongoUrl = process.env.MONGODB_CONNECTION_URL!;

try {
  await startServer(+port);
  debug(`Start with server 'http://localhost:${port}'`);

  await connectDatabase(mongoUrl);
} catch (error) {
  debug(error.message);
}
