const { body, validationResult } = require("express-validator")
const asyncHandler = require("express-async-handler")

const Category = require("../models/category")
const Item = require("../models/item")

exports.categoryList = asyncHandler(async (req, res, next) => {
  const categoryList = await Category.find().sort({ name: 1 }).exec()
  res.render("categoryList", {
    title: "Categories",
    categoryList,
  })
})

exports.createCategoryGet = asyncHandler(async (req, res, next) => {
  res.render("categoryForm", {
    title: "Create Category",
    category: {},
  })
})

exports.createCategoryPost = [
  body("name", "Name must be specified").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must be specified").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    })

    if (errors.isEmpty()) {
      await category.save()
      res.redirect(category.url)
    } else {
      res.render("categoryForm", {
        title: "Create Category",
        category,
        errors: errors.array(),
      })
    }
  }),
]

exports.deleteCategoryGet = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find(
      { category: req.params.id, number_in_stock: { $gt: 0 } },
      "name description"
    )
      .sort({ name: 1 })
      .exec(),
  ])

  if (category == null) {
    res.redirect("/catalog/categories")
  } else {
    res.render("categoryDelete", {
      title: "Delete Category",
      category,
      items: allItemsInCategory,
    })
  }
})

exports.deleteCategoryPost = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find(
      { category: req.params.id, number_in_stock: { $gt: 0 } },
      "name description"
    )
      .sort({ name: 1 })
      .exec(),
  ])

  if (allItemsInCategory.length) {
    res.render("categoryDelete", {
      title: "Delete Category",
      category,
      items: allItemsInCategory,
    })
  } else {
    await category.deleteOne().exec()
    await Promise.all(allItemsInCategory.map((item) => item.deleteOne().exec()))
    res.redirect("/catalog/categories")
  }
})

exports.updateCategoryGet = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec()
  if (category == null) {
    res.redirect("/catalog/categories")
  } else {
    res.render("categoryForm", {
      title: "Update Category",
      category,
    })
  }
})

exports.updateCategoryPost = [
  body("name", "Name must be specified").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must be specified").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    })

    if (errors.isEmpty()) {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category
      ).exec()
      res.redirect(updatedCategory.url)
    } else {
      res.render("categoryForm", {
        title: "Update Category",
        category,
        errors: errors.array(),
      })
    }
  }),
]

exports.categoryDetail = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name description")
      .sort({ name: 1 })
      .exec(),
  ])

  if (category == null) {
    const err = new Error("Category not found")
    err.status = 404
    return next(err)
  } else {
    res.render("categoryDetail", {
      category,
      allItemsInCategory,
    })
  }
})
