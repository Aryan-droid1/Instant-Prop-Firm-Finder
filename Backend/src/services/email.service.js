const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendOTPEmail = async (
  email,
  otp
) => {
  const response =
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify Your Account",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">

    <h1 style="color:#10b981;">
      PropCompare
    </h1>

    <p>Hello Trader,</p>

    <p>
      Welcome to <strong>PropCompare</strong>.
      To complete your registration, please verify your email address using the code below:
    </p>

    <div style="
      background:#f3f4f6;
      border-radius:8px;
      padding:20px;
      text-align:center;
      margin:20px 0;
    ">
      <h2 style="
        margin:0;
        font-size:32px;
        letter-spacing:4px;
      ">
        ${otp}
      </h2>
    </div>

    <p>
      This verification code will expire in
      <strong>10 minutes</strong>.
    </p>

    <p>
      If you did not request this email, you can safely ignore it.
    </p>

    <hr style="margin:30px 0;" />

    <p style="
      color:#666;
      font-size:12px;
    ">
      © 2026 PropCompare
      <br/>
      Compare prop firms, payouts, drawdowns and trading rules.
    </p>

  </div>
  `,
    });

  console.log(
    "Resend Response:",
    response
  );

  return response;
};

module.exports = {
  sendOTPEmail,
};