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
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
    getAllUserOrders
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);

router.put("/reset-password/:token", resetPassword);

router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/all-users", getAllUser);
router.get("/get-orders", authMiddleware, getOrders);  
router.get("/getallorders",authMiddleware, isAdmin,getAllUserOrders)  
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);

router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteUser);

router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus);
router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);

module.exports = router