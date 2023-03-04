const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  reportID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "report",
    required: true,
  },

  paid: {
    type: Boolean,
    default: false,
  },
});

const PaymentModel = mongoose.model("payment", paymentSchema);

module.exports = { PaymentModel };
