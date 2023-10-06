const mongoose = require("mongoose");

var orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingInfo: {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      mobile: {
        type: Number,
        required: true,
      },
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    paidAt: {
      type: Date,
      default: Date.now(),
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalPriceAfterDiscount: {
      type: Number,
      required: false,
    },
    orderStatus: {
      type: String,
      default: "Ordered",
    },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Order", orderSchema);
