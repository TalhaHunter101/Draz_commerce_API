const product = require("../Schema/product_Schema");
const coustomer = require("../Schema/coustomer_schema.js");
const Cart = require("../Schema/cart_schema");
const Order = require("../Schema/oders_schema");

const dotenv = require("dotenv");
var express = require("express");
var jwt = require("jsonwebtoken");
var app = express();
dotenv.config();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// i have not limited the search for coustomer because products will be senn wether you are login or not
exports.view_all_products = async (req, res, next) => {
  if (req.body.title && req.body.category) {
    product.find(
      {
        title: { $regex: new RegExp(req.body.title, "i") },
        category: { $regex: new RegExp(req.body.category, "i") },
      },
      (err, find) => {
        if (find && find != "") {
          res.status(200).json({
            Message: "Success products with title and category found",
            Data: find,
          });
        } else {
          res.status(404).json({ Message: "No record found" });
        }
      }
    );
  } else if (req.body.category && !req.body.title) {
    product.find(
      {
        category: { $regex: new RegExp(req.body.category, "i") },
      },
      (err, find) => {
        if (find && find != "") {
          res.status(200).json({
            Message: "Success products with category found",
            Data: find,
          });
        } else {
          res.status(404).json({ Message: "No record found" });
        }
      }
    );
  }
  if (req.body.title && !req.body.category) {
    product.find(
      {
        title: { $regex: new RegExp(req.body.title, "i") },
      },
      (err, find) => {
        if (find && find != "") {
          res.status(200).json({
            Message: "Success: products with title found",
            Data: find,
          });
        } else {
          res.status(404).json({ Message: "No record found" });
        }
      }
    );
  } else if (!req.body.title && !req.body.category) {
    product.find({}, (err, find) => {
      if (find && find != "") {
        res
          .status(200)
          .json({ Message: "Success all products found", Data: find });
      } else {
        res.status(404).json({ Message: "No record found" });
      }
    });
  }
};

exports.add_to_cart = async (req, res) => {
  if (req.body.p_id == "" || req.body.p_id == undefined) {
    res.status(400).json({ Message: "Missing product Id" });
  } else {
    product.findOne({ _id: req.body.p_id }, (err, find) => {
      if (find) {
        if (find.quatity > req.body.quantity) {
          Cart.findOne({ coustomer_id: req.user.user_id }).then((cart) => {
            if (cart) {
              Cart.findOne(
                {
                  coustomer_id: req.user.user_id,
                  Products: { $elemMatch: { p_id: req.body.p_id } },
                },
                (err, docx) => {
                  if (docx && docx != "") {
                    res.status(400).json({
                      Message: "This product already present in your cart",
                    });
                    return;
                  } else {
                    cart.Products.push({
                      // cart already present means that delivery charges had been added
                      Title: find.title,
                      Price: find.price,
                      quantity: req.body.quantity,
                      p_id: req.body.p_id,
                    });
                    cart.subtotal += find.price;
                    cart.total = cart.subtotal + 100;
                    cart.save();
                    res
                      .status(200)
                      .json({ Message: "New product added to cart" });
                  }
                }
              );
            } else {
              // let assume 100 is the delivery charges
              let newcart = new Cart({
                coustomer_id: req.user.user_id,
                Products: {
                  Title: find.title,
                  Price: find.price,
                  quantity: req.body.quantity,
                  p_id: find._id,
                },
                subtotal: find.price,
                total: find.price + 100,
              });
              newcart.save();
              res.status(200).json({ Message: "New cart created" });
            }
          });
        } else {
          res.status(400).json({ Message: "Out of stock for this quantity" });
        }
      } else {
        res.status(404).json({ Message: "No product found to add on cart" });
      }
    });
  }
};

exports.add_address = async (req, res, next) => {
  //   console.log(req.user);
  if (req.body.Address == "" || req.body.Address == undefined) {
    res.status(400).json({ Message: "Street Address missing :: Enter Again" });
  } else if (req.body.City == "" || req.body.City == undefined) {
    res.status(400).json({ Message: "City missing :: Enter Again" });
  } else if (req.body.ZipCode == "" || req.body.ZipCode == undefined) {
    res.status(400).json({ Message: "ZipCode missing :: Enter Again" });
  } else if (req.body.ZipCode.length == 4) {
    res.status(400).json({ Message: "Zip code should be 4 numbers" });
  } else if (req.body.Country == "" || req.body.Country == undefined) {
    res.status(400).json({ Message: "Country missing :: Enter Again" });
  } else if (req.user.U_type == "coustomer") {
    coustomer.findOne({ _id: req.user.user_id }, (err, find) => {
      if (find) {
        find.Shipping_Address.Address = req.body.Address;
        find.Shipping_Address.City = req.body.City;
        find.Shipping_Address.ZipCode = req.body.ZipCode;
        find.Shipping_Address.Country = req.body.Country;
        find.save();
        res
          .status(200)
          .json({ Message: "Address Added to the coustomer profile" });
      } else {
        res.status(400).json({ Message: "No coustomer found" });
      }
    });
  }
};

exports.placoder = async (req, res, next) => {
  if (req.user.U_type == "coustomer") {
    Cart.findOne({ coustomer_id: req.user.user_id }, (err, find) => {
      if (find) {
        coustomer.findById({ _id: req.user.user_id }, (err, cous) => {
          if (!cous.Shipping_Address) {
            res.status(400).json({ message: "Shipping address not provided" });
          } else {
            // let neworder = new Order({
            //   Cemail: req.user.emil,
            //   Cname: cous.fullname,
            //   Products: find.Products,
            //   total: find.total,
            //   ShippingAddress:
            //     cous.Shipping_Address.Address +
            //     ", " +
            //     cous.Shipping_Address.City +
            //     ", " +
            //     cous.Shipping_Address.ZipCode +
            //     ", " +
            //     cous.Shipping_Address.Country,
            // });
            // neworder.save();
            console.log(find.Products);

            console.log(find.Products[0].quantity);

            for (var i = 0; i < find.Products.length; i++) {
              product.findOne({ _id: find.Products[i].p_id }, (err, pfind) => {
                console.log(pfind.quatity);
                pfind.quatity = pfind.quatity - find.Products[i].quantity;
                pfind.save();
              });
            }
            res
              .status(200)
              .json({ Message: "Your order placed and cart celeared" });
          }
        });
      } else {
        res
          .status(404)
          .json({ Message: "You don't have any product in your cart" });
        return;
      }
    });
  } else {
    res.status(400).json({ Message: "You are not our coustomer" });
    return;
  }
};





// title: { type: String,  },
// description: { type: String, },
// category: { type: String, },
// quantity: { type: Number,  },

// pricing: {
//   price: { type: Number,},
//   Shipping_fee: { type: Number, default: 100 },
// },
// //schma.Types.ObjectId, ref: "brands"
// Specifications: {
//   Brand: { type: String },
//   Operating_System: { type: String,  },
//   RAM: { type: String,  },
//   Memory: { type: String,  },
//   Color: { type: String,  },
//   Warranty: { type: String, },
//   Camera: { type: String,  },
//   Dual_sim: { type: Boolean,},