const express = require('express')
const {createBrand, updateBrand, deleteBrand, getAllBrand, getBrand} = require('../controller/brandCtrl')
const router = express.Router()
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');

router.post("/", authMiddleware, isAdmin, createBrand)
router.put('/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/:id', authMiddleware, isAdmin, deleteBrand);
router.get('/',getAllBrand);
router.get('/:id',getBrand);

module.exports = router
