const express = require('express');
const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishList, ratingProduct, uploadImage } = require('../controller/productCtrl');
const router = express.Router();
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');
//router phải dùng dấu "" ngoặc kép, còn ngoặc đơn đéo được

router.post("/", authMiddleware, isAdmin, createProduct)
router.get("/:id", getaProduct)
router.get("/", getAllProduct);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadImage)
router.put("/wishlist", authMiddleware, addToWishList)
router.put("/rating", authMiddleware, ratingProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);

module.exports = router 