const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler")

const Item = require("../models/item")
const Category = require("../models/category")

exports.index = asyncHandler(async (req, res, next) => {
  const categoryCount = await Category.countDocuments().exec()
  const itemCount = await Item.countDocuments().exec()

  res.render("index", {
    title: "Intergalactic Spaceship Store",
    categoryCount,
    itemCount,
  })
})

exports.itemList = asyncHandler(async (req, res, next) => {
  res.send("itemList")
})

exports.createItemGet = asyncHandler(async (req, res, next) => {
  res.send("createItemGet")
})

exports.createItemPost = asyncHandler(async (req, res, next) => {
  res.send("createItemPost")
})

exports.deleteItemGet = asyncHandler(async (req, res, next) => {
  res.send("deleteItemGet")
})

exports.deleteItemPost = asyncHandler(async (req, res, next) => {
  res.send("deleteItemPost")
})

exports.updateItemGet = asyncHandler(async (req, res, next) => {
  res.send("updateItemGet")
})

exports.updateItemPost = asyncHandler(async (req, res, next) => {
  res.send("updateItemPost")
})

exports.itemDetail = asyncHandler(async (req, res, next) => {
  res.send("itemDetail")
})
