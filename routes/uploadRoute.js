const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  ImgResize,
} = require("../middlewares/uploadImages");
//router phải dùng dấu "" ngoặc kép, còn ngoặc đơn đéo được

router.post(
  "/",
  authMiddleware,
  isAdmin,
  ImgResize,
  uploadPhoto.array("images", 10),
  uploadImages
);

router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;