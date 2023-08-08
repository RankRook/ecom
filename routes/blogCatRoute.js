const express = require('express');
const { createBlogCategory, updateBlogCategory,getAllBlogCategory, getBlogCategory, deleteBlogCategory } = require('../controller/blogCatCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware, isAdmin, createBlogCategory);
router.put('/:id',authMiddleware, isAdmin, updateBlogCategory);
router.get('/', getAllBlogCategory)
router.get('/:id', getBlogCategory)
router.delete('/:id',authMiddleware, isAdmin, deleteBlogCategory)

module.exports = router
