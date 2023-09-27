const Coupon = require("../models/couponModels");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const createCoupon = await Coupon.create(req.body);
    res.json(createCoupon);
  } catch (err) {
    throw new Error(err);
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const allCoupons = await Coupon.find();
    res.json(allCoupons);
  } catch (err) {
    throw new Error(err);
  }
});

const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findById(id);
    res.json(coupon);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    res.json(deleteCoupon);
  } catch (err) {
    throw new Error(err);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCoupon);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
