const Category = require('../models/proCategoryModels');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async (req, res) => {
    console.log(req.body)
    try{
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    }catch(err){
        throw new Error(err)
    }
})

const updateCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateCategory);
    }catch(err){
        throw new Error(err)
    }
})

const deleteCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteCategory = await Category.findByIdAndDelete(id);
        res.json(deleteCategory);
    }catch(err){
        throw new Error(err)
    }
})

const getCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try{
        const getACategory = await Category.findById(req.params.id);
        res.json(getACategory);
    }catch(err){
        throw new Error(err)
    }
})

const getAllCategory = asyncHandler(async (req, res) => {
    try{
        const getAllCategory = await Category.find();
        res.json(getAllCategory);
    }catch(err){
        throw new Error(err)
    }
})

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory,
}