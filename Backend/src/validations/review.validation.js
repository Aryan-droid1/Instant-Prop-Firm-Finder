const { z } = require("zod");

const createReviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),

  comment: z
    .string()
    .trim()
    .min(5, "Comment must be at least 5 characters")
});
module.exports = {
  createReviewSchema
};