const router = require("express").Router()

const categoryController = require("../controllers/categoryController")
const itemController = require("../controllers/itemController")

// Item Routes
router.get("/", itemController.index)

router.get("/items", itemController.itemList)

router.get("/item/create", itemController.createItemGet)

router.post("/item/create", itemController.createItemPost)

router.get("/item/:id/delete", itemController.deleteItemGet)

router.post("/item/:id/delete", itemController.deleteItemPost)

router.get("/item/:id/update", itemController.updateItemGet)

router.post("/item/:id/update", itemController.updateItemPost)

router.get("/item/:id", itemController.itemDetail)

// Category Routes
router.get("/categories", categoryController.categoryList)

router.get("/category/create", categoryController.createCategoryGet)

router.post("/category/create", categoryController.createCategoryPost)

router.get("/category/:id/delete", categoryController.deleteCategoryGet)

router.post("/category/:id/delete", categoryController.deleteCategoryPost)

router.get("/category/:id/update", categoryController.updateCategoryGet)

router.post("/category/:id/update", categoryController.updateCategoryPost)

router.get("/category/:id", categoryController.categoryDetail)

module.exports = router
