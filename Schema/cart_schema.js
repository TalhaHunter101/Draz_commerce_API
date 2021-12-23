const mongoose = require("mongoose");
const schma = mongoose.Schema;

const Cart = new schma({
  coustomer_id: { type: String },
  Products: [
    {
      p_id: { type: String },
      Title: { type: String },
      Price: { type: Number, default: 0 },
      quantity: { type: Number, default: 0 },
    },
  ],
  subtotal: { type: Number },
  total: { type: Number },
});

module.exports = mongoose.model("cart", Cart);
