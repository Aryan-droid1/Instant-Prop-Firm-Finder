const express = require('express');
const {
  register , loginUser
} = require('../controllers/auth.controller');
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema
} = require("../validations/auth.validation");

const router = express.Router();

router.post('/register',validate(registerSchema), register);
router.post('/login' ,validate(loginSchema), loginUser);

module.exports = router;