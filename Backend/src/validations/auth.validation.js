const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  role: z.enum(["user", "admin"]).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
const resendOTPSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),
});


const verifyEmailSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});


module.exports = {
  registerSchema,verifyEmailSchema,
  loginSchema,resendOTPSchema
};