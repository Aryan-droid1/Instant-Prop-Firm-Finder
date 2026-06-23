const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const validate = require("../middlewares/validate.middleware");
const {
  createReviewSchema
} = require('../validations/review.validation');
const {
  createReview,
  getFirmReviews,deleteReview
} = require('../controllers/review.controller');

router.post(
  '/',
  authMiddleware,
  validate(createReviewSchema),
  createReview
);

router.get('/firm/:firmId', getFirmReviews);
router.delete(
  '/:reviewId',
  authMiddleware,
  adminMiddleware,

  deleteReview
);


module.exports = router;