const express = require('express');
const { createUser,
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
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    saveAddress,
    getWishlist,
    userCart,
    getUserCart,
    createOrder,
    // emptyCart,
    applyCoupon,
    // getOrders,
    updateOrders,
    getSingleOrders,
    getAllOrders,
    removeProdFromCart,
    getMonthWiseOrderIncome,
    getMyOrders,
    getYearlyTotalOrders,
    getMonthWiseOrderCount,
    updateProdQuantityFromCart
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
// const { checkout, paymentVerification } = require('../controller/paymentCtrl');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config()

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);

router.put("/reset-password/:token", resetPassword);

router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);

router.get('/checkout/config', (req, res) => {
    return res.status(200).json({
      status: 'OK',
      data: process.env.CLIENT_ID
    })
  })
  
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart/create-order", authMiddleware, createOrder);
router.get("/all-users",  getAllUser);
router.get("/getmyorders", authMiddleware, getMyOrders)
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders)
router.get("/getaorder/:id", authMiddleware, getSingleOrders)
router.put("/updateOrder/:id", authMiddleware, isAdmin, updateOrders)

router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.get("/getMonthWiseOrderIncome", authMiddleware, getMonthWiseOrderIncome);
router.get("/getMonthWiseOrderCount", authMiddleware, getMonthWiseOrderCount);
router.get("/getYearlyTotalOrders", authMiddleware, getYearlyTotalOrders);

router.get("/use-info", authMiddleware,getUser);

router.delete("/delete-product-cart/:cartItemId", authMiddleware, removeProdFromCart);
router.delete("/update-product-cart/:cartItemId/:newQuantity", authMiddleware, updateProdQuantityFromCart);

// router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteUser);

// router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);
router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router