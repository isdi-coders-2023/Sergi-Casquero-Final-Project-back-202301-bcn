import type cors from "cors";

const netlifyUrl = process.env.NETLIFY_URL!;

const allowedOrigins = [`http://localhost:3000`, netlifyUrl];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

export default options;
