const express = require('express')
const {createBrand, updateBrand, deleteBrand, getAllBrand, getBrand} = require('../controller/brandCtrl')
const router = express.Router()
const {isAdmin, middleware} = require('../middlewares/authMiddleware')

// router.post('/', middleware, isAdmin, createBrand);
// router.put('/', middleware, isAdmin, updateBrand);
// router.delete('/:id', middleware, isAdmin, deleteBrand);
router.get('/',getAllBrand);
router.get('/:id',getBrand);

module.exports = router
