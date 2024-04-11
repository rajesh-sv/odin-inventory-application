const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, default: 0 },
})

ItemSchema.virtual("url").get(function () {
  return `/catalog/item/${this._id}`
})

module.exports = mongoose.model("Item", ItemSchema)
