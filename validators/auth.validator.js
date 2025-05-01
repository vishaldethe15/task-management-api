import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 30 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),

  password: Joi.string()
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,20}$"))
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be 6–20 characters long, contain at least one uppercase letter and one number",
    }),

  role: Joi.string().valid("user", "manager", "admin").optional().messages({
    "any.only": "Role must be one of user, manager, or admin",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email address",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
});
