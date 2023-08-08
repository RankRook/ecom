const express = require('express');
const { createCategory,updateCategory,deleteCategory, getAllCategory,getCategory } = require('../controller/proCategoryCtrl');
const router = express.Router();
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createCategory);
router.put('/:id',authMiddleware, updateCategory);
router.delete('/:', authMiddleware, deleteCategory);
router.get('/',getAllCategory)
router.get('/:id',getCategory)

module.exports = router