const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  role: z.enum(["user", "admin"]).optional()
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

module.exports = {
  registerSchema,
  loginSchema
};