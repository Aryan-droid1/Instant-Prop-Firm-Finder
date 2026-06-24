const express = require('express');
const {
  register , loginUser,verifyEmail, resendOTP
} = require('../controllers/auth.controller');
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema,verifyEmailSchema,resendOTPSchema
} = require("../validations/auth.validation");


const router = express.Router();

router.post('/register',validate(registerSchema), register);
router.post('/login' ,validate(loginSchema), loginUser);
router.post( "/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post( "/resend-otp", validate(resendOTPSchema), resendOTP);

module.exports = router;