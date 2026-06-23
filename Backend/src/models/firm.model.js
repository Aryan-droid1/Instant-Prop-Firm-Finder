const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    accountType: {
      type: String,
      required: true
    },

    challengeFee: {
      type: Number,
      required: true
    },

    profitSplit: {
      type: Number,
      required: true
    },

    dailyDrawdown: {
      type: Number,
      required: true
    },

    overallDrawdown: {
      type: Number,
      required: true
    },

    drawdownType: {
      type: String,
      enum: ['Static', 'Trailing'],
      required: true
    },

    newsTrading: {
      type: Boolean,
      default: false
    },
    consistencyRule: {
       type: Number,
       default: 0,
      },

    weekendHolding: {
      type: Boolean,
      default: false
    },
    consistencyRule: {
      type: Number,
      default: 0,
      },

    payoutFrequency: {
      type: String
    },

    description: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Firm', firmSchema);