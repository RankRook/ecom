const express = require('express');
const { createUser,
    loginUser,
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
    resetPassword
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser)
router.post("/forgot-password-token", forgotPasswordToken)
router.put("/reset-password/:token", resetPassword)
router.get('/all-user', getAllUser)
router.get("/refresh", handleRefreshToken);
router.get('/:id', authMiddleware, isAdmin, getUser)
router.get("/logout", logout)
router.delete('/:id', deleteUser)
router.put("/password", authMiddleware, updatePassword)
router.put('/edit-user', authMiddleware, updatedUser)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser)
module.exports = router