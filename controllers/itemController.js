const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler")

const Item = require("../models/item")
const Category = require("../models/category")

exports.index = asyncHandler(async (req, res, next) => {
  const [categoryCount, itemCount] = await Promise.all([
    Category.countDocuments().exec(),
    Item.countDocuments().exec(),
  ])

  res.render("index", {
    title: "Intergalactic Spaceship Store",
    categoryCount,
    itemCount,
  })
})

exports.itemList = asyncHandler(async (req, res, next) => {
  const itemList = await Item.find({}, "name category")
    .populate("category")
    .sort({ name: 1 })
    .exec()
  res.render("itemList", {
    title: "Spaceships",
    itemList,
  })
})

exports.createItemGet = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}, "name").sort({ name: 1 }).exec()

  res.render("itemForm", {
    title: "Create Spaceship",
    categories,
  })
})

exports.createItemPost = [
  body("name", "Name must be specified").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must be specified").trim().isNumeric().escape(),
  body("number_in_stock", "Number in-stock must be specified")
    .trim()
    .isNumeric()
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    })

    if (errors.isEmpty()) {
      await item.save()
      res.redirect(item.url)
    } else {
      const categories = await Category.find({}, "name")
        .sort({ name: 1 })
        .exec()

      res.render("itemForm", {
        title: "Create Spaceship",
        item,
        categories,
      })
    }
  }),
]

exports.deleteItemGet = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id, "name").exec()

  if (item == null) {
    res.redirect("/catalog/items")
  } else {
    res.render("itemDelete", {
      title: "Delete Shaceship",
      item,
    })
  }
})

exports.deleteItemPost = [
  body("secretkey").trim().equals("42").escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    const item = { name: req.body.itemname }

    if (!errors.isEmpty()) {
      res.render("itemDelete", {
        title: "Delete Shaceship",
        item,
        secretkey: req.body.secretkey,
      })
    } else {
      const item = await Item.findById(req.params.id).exec()
      if (item.number_in_stock > 1) {
        const newItem = new Item({
          ...item,
          number_in_stock: item.number_in_stock - 1,
          _id: item._id,
        })
        await Item.findByIdAndUpdate(req.params.id, newItem).exec()
      } else {
        await Item.findByIdAndDelete(req.params.id).exec()
      }
      res.redirect("/catalog/items")
    }
  }),
]

exports.updateItemGet = asyncHandler(async (req, res, next) => {
  const [categories, item] = await Promise.all([
    Category.find({}, "name").sort({ name: 1 }).exec(),
    Item.findById(req.params.id).exec(),
  ])

  res.render("itemForm", {
    title: "Create Spaceship",
    item,
    categories,
  })
})

exports.updateItemPost = [
  body("name", "Name must be specified").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must be specified").trim().isNumeric().escape(),
  body("number_in_stock", "Number in-stock must be specified")
    .trim()
    .isNumeric()
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      _id: req.params.id,
    })

    if (errors.isEmpty()) {
      const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        item
      ).exec()
      res.redirect(updatedItem.url)
    } else {
      const categories = await Category.find({}, "name")
        .sort({ name: 1 })
        .exec()

      res.render("itemForm", {
        title: "Create Spaceship",
        item,
        categories,
      })
    }
  }),
]

exports.itemDetail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec()
  if (item == null) {
    const err = new Error("Spaceship not found")
    err.status = 404
    return next(err)
  } else {
    res.render("itemDetail", {
      item,
    })
  }
})
