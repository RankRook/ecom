const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, disLikeBlog } = require('../controller/blogCtrl');
const router = express.Router();
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');


router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/likes/', authMiddleware, likeBlog)
router.put('/dislike/', authMiddleware, disLikeBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.get('/:id', getBlog)
router.get('/', getAllBlogs)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)

module.exports = router