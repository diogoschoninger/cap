import Joi from 'joi';

export default {
  register: {
    body: Joi.object({
      name: Joi.string()
        .regex(/^[a-zA-Zà-úÀ-Ú\s]+$/)
        .required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(255).required(),
    }),
  },

  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(255).required(),
    }),
  },

  createDocument: {
    body: Joi.object({
      description: Joi.string().required(),
      value: Joi.string().required(),
      expiration: Joi.date().required(),
      user_owner: Joi.number().required(),
      payment: Joi.number().required(),
      situation: Joi.number().required(),
    }),
  },

  closeDocument: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
};
