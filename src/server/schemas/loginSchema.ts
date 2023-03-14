import { Joi } from "express-validation";

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

export default loginSchema;
