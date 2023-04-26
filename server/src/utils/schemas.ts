import Joi from 'joi';

export default {
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(255).required(),
    }),
  },
};
