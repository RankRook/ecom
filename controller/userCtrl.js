const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModels");
const Order = require("../models/orderModel");
const uniqid = require("uniqid");

const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateToken } = require("../config/jwToken");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");
//Create User functionality

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // Create a new user document with only the desired fields
    const newUser = new User({
      address: req.body.address,
      country: req.body.country,
      city: req.body.city,
      firstname : req.body.firstname,
      lastname : req.body.lastname,
      email : req.body.email,
      mobile : req.body.mobile,
      password : req.body.password,
    });

    // Optionally, you can also set other fields if needed


    // Save the user document
    await newUser.save();
    console.log(newUser)
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});


//Login functionality

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//login Admin

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorized");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshTtoken", refreshToken, {
      httpOnly: true,
      maxAge: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentia");
  }
});

// Refresh Token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

//Update a user

const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
        country: req?.body?.country,
        city: req?.body?.city,
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all users

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find().populate("wishlist");
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const getUser = asyncHandler(async (req, res) => {

  try {
    const getaUser = await User.findById(req.user.id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});
// Delete functionality

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Block User functionality

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockusr);
  } catch (error) {
    throw new Error(error);
  }
});

//Unblock User functionality

const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json(unblock);
  } catch (error) {
    throw new Error(error);
  }
});

// update password

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

// forgot password token

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      html: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

//reset password

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

// add to wishlist

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json({
      findUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Save user andress

const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    // Extract the address details from the request body
    const { country, city, address } = req.body;
    // Create a new address object
    const newAddress = {
      country,
      city,
      address,
    };
    // Push the new address into the user's addresses array
    user.addresses.push(newAddress);
    // Save the user's updated data
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});



const userCart = asyncHandler(async (req, res) => {
  const { productId, quantity, price } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let newCart = await new Cart({
      userId: _id,
      productId,
      quantity,
      price,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.find({ userId: _id }).populate("productId");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const removeProdFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId } = req.params;
  validateMongoDbId(_id);
  try {
    const deleteProdFromCart = await Cart.deleteOne({
      userId: _id,
      _id: cartItemId,
    });
    res.json(deleteProdFromCart);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProdQuantityFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId, newQuantity } = req.params;
  validateMongoDbId(_id);
  try {
    const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId });
    cartItem.quantity = newQuantity;
    cartItem.save();
    res.json(cartItem);
  } catch (error) {
    throw new Error(error);
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    totalPrice,
    totalPriceAfterDiscount,
    paymentMethod,
    isPaid,
    paidAt,
  } = req.body;
  const { _id } = req.user;

  try {
    const promises = orderItems.map(async (order) => {
      const product = await Product.findOneAndUpdate(
        {
          _id: order.product,
          quantity: { $gte: order.quantity },
        },
        {
          $inc: {
            quantity: -order.quantity,
            sold: +order.quantity,
          },
        },
        { new: true }
      );
      if (!product) {
        throw new Error(`Sản phẩm với ID ${order.product} không còn đủ hàng.`);
      }
    });
    await Promise.all(promises);
    const order = await Order.create({
      shippingInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      paymentMethod,
      isPaid,
      paidAt,
      user: _id,
    });

    res.json({
      order,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: "Lỗi trong quá trình tạo đơn hàng.",
    });
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });

  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }

  const user = await User.findOne({ _id });
  const order = await Order.findOne({ user: user._id });

  if (!order) {
    throw new Error("Order not found");
  }

  // Tính toán giá trị mới sau khi áp dụng mã giảm giá
  const { totalPrice } = order;
  const totalAfterDiscount = (
    totalPrice -
    (totalPrice * validCoupon.discount) / 100
  ).toFixed(2);

  // Cập nhật giá trị mới vào đơn hàng
  const updatedOrder = await Order.findOneAndUpdate(
    { user: user._id },
    { totalAfterDiscount },
    { new: true }
  );

  res.json(updatedOrder);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const orders = await Order.find({ user: _id })
      .populate("user")
      .populate("orderItems.product");
    res.json(orders);
  } catch (err) {
    throw new Error(err);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find().populate('user')
    res.json(orders);
  } catch (err) {
    throw new Error(err);
  }
});

const getSingleOrders = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.findOne({_id:id}).populate("orderItems.product")
    res.json(orders);
  } catch (err) {
    throw new Error(err);
  }
});

const updateOrders = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.findById(id)
    orders.orderStatus = req.body.status
    await orders.save()
    res.json(orders);
  } catch (err) {
    throw new Error(err);
  }
});


const getMonthWiseOrderIncome = asyncHandler(async (req, res) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let i = 0; i < 11; i++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
        },
        amount: { $sum: "$totalPriceAfterDiscount" },
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(data);
});
const getMonthWiseOrderCount = asyncHandler(async (req, res) => {
  let month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let i = 0; i < 11; i++) {
    d.setMonth(d.getMonth() - 1);
    endDate = month[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
        },
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(data);
});

const getYearlyTotalOrders = asyncHandler(async (req, res) => {
  let month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let i = 0; i < 11; i++) {
    d.setMonth(d.getMonth() - 1);
    endDate = month[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        // month: null,
        count: { $sum: 1 },
        amount: { $sum: "$totalPriceAfterDiscount" },
      },
    },
  ]);
  res.json(data);
});

module.exports = {
  createUser,
  loginUserCtrl,
  getAllUser,
  getUser,
  deleteUser,
  updatedUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  resetPassword,
  forgotPasswordToken,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  applyCoupon,
  getMyOrders,
  createOrder,
  updateProdQuantityFromCart,
  getMonthWiseOrderIncome,
  getMonthWiseOrderCount,
  getYearlyTotalOrders,
  removeProdFromCart,
  getAllOrders,
  getSingleOrders,
  updateOrders
};
