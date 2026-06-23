const Review = require('../models/review.model');
const Firm = require('../models/firm.model');

async function createReview(req, res) {
  try {
    const { firmId, rating, comment } = req.body;

    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({
        success: false,
        message: 'Firm not found',
      });
    }

    const existingReview = await Review.findOne({
      firm: firmId,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this firm',
      });
    }

    const review = new Review({
      firm: firmId,
      user: req.user.id,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getFirmReviews(req, res) {
  try {
    const reviews = await Review.find({
      firm: req.params.firmId,
    })
      .populate('user', 'name email')
      .populate('firm', 'name');

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
async function deleteReview(req, res) {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
module.exports = {
  createReview,
  getFirmReviews,deleteReview
};