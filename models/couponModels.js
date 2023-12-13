const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  appliedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);