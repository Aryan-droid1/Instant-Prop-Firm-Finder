const { z } = require("zod");

const createFirmSchema = z.object({
  name: z
    .string()
    .min(2, "Firm name must be at least 2 characters"),

  accountType: z
    .string()
    .min(2, "Account type is required"),

  challengeFee: z
    .number()
    .positive("Challenge fee must be positive"),

  profitSplit: z
    .number()
    .min(1, "Profit split must be at least 1")
    .max(100, "Profit split cannot exceed 100"),

  dailyDrawdown: z
    .number()
    .positive("Daily drawdown must be positive"),
  consistencyRule: z.coerce.number().optional(),

  overallDrawdown: z
    .number()
    .positive("Overall drawdown must be positive"),

  drawdownType: z.enum(
    ["Static", "Trailing"],
    {
      message: "Drawdown type must be Static or Trailing"
    }
  ),

  newsTrading: z.boolean().optional(),

  weekendHolding: z.boolean().optional(),

  payoutFrequency: z.string().optional(),

  description: z.string().optional()
});
const updateFirmSchema = createFirmSchema.partial();
module.exports = {
  createFirmSchema,updateFirmSchema
  
};