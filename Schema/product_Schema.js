const mongoose = require("mongoose");
const schma = mongoose.Schema;

const product = new schma({
  seller_id: { type: schma.Types.ObjectId, ref: "seller" },
  title: {
    type: String,
  },
  discription: { type: String },
  reviews: [{ type: String }],
  category: { type: String },
  quatity: { type: Number },
  price: { type: Number },
});
module.exports = mongoose.model("product", product);
