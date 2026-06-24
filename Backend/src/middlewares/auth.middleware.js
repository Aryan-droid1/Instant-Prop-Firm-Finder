const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: 'Token missing'
      });
    }
    console.log(process.env.JWT_TOKEN);
    console.log(req.headers.authorization);

    const decoded = jwt.verify(
      token,
      process.env.JWT_TOKEN
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.log(error);
    return res.status(401).json({
      message: error.message
    });
  }
}

module.exports = authMiddleware; 