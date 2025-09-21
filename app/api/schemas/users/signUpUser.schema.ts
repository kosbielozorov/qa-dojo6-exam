import Joi from 'joi';

export const userResponseSchema = Joi.object({
  user: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    token: Joi.string().required(),
  }).required(),
});
