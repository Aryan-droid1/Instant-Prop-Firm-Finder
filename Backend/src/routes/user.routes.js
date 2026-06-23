const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/profile',authMiddleware,(req, res) => {
    res.json({
      message: 'Protected Route',
      user: req.user
    });
  }
);
router.get(
    "/admin-test",
    authMiddleware,
    adminMiddleware,
    (req, res) => {
        res.json({
            message: "Welcome Admin"
        });
    }
);


module.exports = router;