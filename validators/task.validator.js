import Joi from "joi";

export const taskSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Title is required",
  }),

  description: Joi.string().trim().allow("", null),

  dueDate: Joi.date().iso().required().messages({
    "date.base": "Due date must be a valid date",
    "any.required": "Due date is required",
  }),

  priority: Joi.string().valid("low", "medium", "high").default("medium"),

  status: Joi.string()
    .valid("pending", "in-progress", "completed", "overdue")
    .default("pending"),

  assignedTo: Joi.string().required().messages({
    "string.empty": "Assigned user is required",
  }),
});
