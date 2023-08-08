const Category = require('../models/blogCatModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')

const createBlogCategory = asyncHandler(async (req, res) => {
    try {
        const newBlogCat = await Category.create(req.body)
        res.json(newBlogCat);
    } catch (err) {
        throw new Error(err);
    }
})


const updateBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updateBlogCat = await Category.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateBlogCat);
    } catch (err) {
        throw new Error(err)
    }
})

const getAllBlogCategory = asyncHandler(async (req, res) => {
    try {
        const getAll = await Category.find();
        res.json(getAll);
    } catch (err) {
        throw new Error(err)
    }
})

const getBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try{
        const getBlogCat = await Category.findById(id)
        res.json(getBlogCat)
    }catch(err){
        throw new Error(err)
    }
})

const deleteBlogCategory = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const deleteBlogCat = await Category.findByIdAndDelete(id)
        res.json(deleteBlogCat)
    }catch(err){
        throw new Error(err)
    }
})

module.exports = { createBlogCategory, updateBlogCategory, getAllBlogCategory, getBlogCategory, deleteBlogCategory }
