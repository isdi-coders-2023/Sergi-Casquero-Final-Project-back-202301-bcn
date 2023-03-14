import { Joi } from "express-validation";

const registerSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

export default registerSchema;
