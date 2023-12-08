const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    const fileKeys = Object.keys(files); 
    for (const key of fileKeys) {
      const file = files[key];
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
     
    }
    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFromCloudinary = await cloudinaryDeleteImg(id, "images");
    const localFilePath = `public/images/${id}`; // Adjust the file extension as needed
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error(`Error deleting local file: ${err}`);
      } else {
        console.log("Local file deleted successfully");
      }
    });
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};


module.exports = {
  uploadImages,
  deleteImages,
};