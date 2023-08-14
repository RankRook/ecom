const express = require('express');
const { createProduct, getaProduct,getAllProduct, updateProduct, deleteProduct, addToWishList, ratingProduct } = require('../controller/productCtrl');
const router = express.Router();
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');
//router phải dùng dấu "" ngoặc kép, còn ngoặc đơn đéo được

router.post("/", authMiddleware, isAdmin, createProduct)
router.get("/:id", getaProduct)
router.get("/", getAllProduct);
router.put("/wishlist", authMiddleware, addToWishList)
router.put("/rating", authMiddleware, ratingProduct)
router.delete("/:id",authMiddleware, isAdmin,  deleteProduct);
router.put("/:id",authMiddleware, isAdmin, updateProduct);

module.exports = router 