const mongoose = require("mongoose");
const schma = mongoose.Schema;

const order = new schma({
  Cemail: { type: String },
  Cname: { type: String },
  Products: [],
  total: { type: Number },
  ShippingAddress: { type: String },
  paymentstatus: { type: String, default: ":::: Cash on delivery::::" },
});

module.exports = mongoose.model("Order", order);
