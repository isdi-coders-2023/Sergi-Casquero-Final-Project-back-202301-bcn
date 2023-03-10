import "../../loadEnvironment.js";
import type cors from "cors";

const netlifyUrl = process.env.NETLIFY_URL!;
const localHost = process.env.LOCAL_HOST!;

const allowedOrigins = [localHost, netlifyUrl];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

export default options;
