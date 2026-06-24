const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const {
  sendOTPEmail,
} = require("../services/email.service");


async function register(req, res) {
  try {
    const { username, email, password } =
      req.body;

    const userExists =
      await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const otp = Math.floor(
      100000 +
      Math.random() * 900000
    ).toString();

    const user = await User.create({
      username,
      email,
      password: hashedPassword,

      isVerified: false,

      verificationOTP: otp,

      verificationOTPExpires:
        Date.now() +
        10 * 60 * 1000,
    });

    await sendOTPEmail(
      email,
      otp
    );

    res.status(201).json({
      message:
        "User created. Verify your email.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({
      $or: [
        { username },
        { email }
      ]
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials"
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Please verify your email first"
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_TOKEN,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
async function verifyEmail(
  req,
  res
) {
  try {
    const { email, otp } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      user.verificationOTP !== otp
    ) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (
      Date.now() >
      user.verificationOTPExpires
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    user.isVerified = true;

    user.verificationOTP = null;
    user.verificationOTPExpires =
      null;

    await user.save();

    res.json({
      message:
        "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
async function resendOTP(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message:
          "Email already verified",
      });
    }

    const otp = Math.floor(
      100000 +
      Math.random() * 900000
    ).toString();

    user.verificationOTP = otp;

    user.verificationOTPExpires =
      Date.now() +
      10 * 60 * 1000;

    await user.save();

    await sendOTPEmail(
      user.email,
      otp
    );

    return res.status(200).json({
      message:
        "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
module.exports = {
  register, loginUser, verifyEmail,resendOTP
};