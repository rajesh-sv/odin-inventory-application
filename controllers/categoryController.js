const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler")

const Category = require("../models/category")

exports.categoryList = asyncHandler(async (req, res, next) => {
  res.send("categoryList")
})

exports.createCategoryGet = asyncHandler(async (req, res, next) => {
  res.send("createCategoryGet")
})

exports.createCategoryPost = asyncHandler(async (req, res, next) => {
  res.send("createCategoryPost")
})

exports.deleteCategoryGet = asyncHandler(async (req, res, next) => {
  res.send("deleteCategoryGet")
})

exports.deleteCategoryPost = asyncHandler(async (req, res, next) => {
  res.send("deleteCategoryPost")
})

exports.updateCategoryGet = asyncHandler(async (req, res, next) => {
  res.send("updateCategoryGet")
})

exports.updateCategoryPost = asyncHandler(async (req, res, next) => {
  res.send("updateCategoryPost")
})

exports.categoryDetail = asyncHandler(async (req, res, next) => {
  res.send("categoryDetail")
})
