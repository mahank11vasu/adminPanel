import Joi from "joi";

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  verifyPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
  }),
  age: Joi.number().integer().min(18).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    "string.pattern.base": "Phone number must be exactly 10 digits",
  }),
  role: Joi.string()
    .valid("manager", "player", "backend dev", "frontend dev", "editor", "organizer", "customer", "subscriber")
    .required(),
  profileImage: Joi.any(), 
});

const loginSchema = Joi.object({
  identifier: Joi.string().required(), 
  password: Joi.string().required(),
});

export const validateRegistration = (req, res, next) => {
  const formData = {
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    verifyPassword: req.body.verifyPassword,
    age: parseInt(req.body.age, 10),
    phone: req.body.phone,
    role: req.body.role,
    profileImage: req.file ? req.file.path : null, 
  };

  const { error } = registerSchema.validate(formData, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((err) => err.message),
    });
  }

  req.body = formData; 
  next();
};

export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};