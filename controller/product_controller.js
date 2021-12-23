const seller = require("../Schema/seller_schema");
const product = require("../Schema/product_Schema");

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

exports.add_product = async (req, res, next) => {
  if (req.body.title == "" || req.body.title == undefined) {
    res.status(400).json({ Message: "Missing title: try Again" });
    return;
  } else if (req.body.discription == "" || req.body.discription == undefined) {
    res.status(400).json({ Message: "Missing discription:: Try again" });
    return;
  } else if (req.body.category == "" || req.body.category == undefined) {
    res.status(400).json({ Message: "Missing category:: Try again" });
    return;
  } else if (req.body.quatity == "" || req.body.quatity == undefined) {
    res.status(400).json({ Message: "Type quatity :: Enter again" });
    return;
  } else if (req.body.price == "" || req.body.price == undefined) {
    res.status(400).json({ Message: "Type price :: Enter again" });
    return;
  } else if (req.user.U_type == "seller") {
    let newproduct = new product({
      title: req.body.title,
      discription: req.body.discription,
      category: req.body.category,
      quatity: req.body.quatity,
      price: req.body.price,
      seller_id: req.user.user_id,
    });
    newproduct.save();
    res.status(400).json({ Message: "Product Saved" });
  } else {
    res.status(400).json({ Message: "You are not our seller" });
    return;
  }
};

exports.delete_product = async (req, res, next) => {
  if (req.body.p_id == "" || req.body.p_id == undefined) {
    res.status(400).json({ Message: "Product Id missing :: Enter again" });
    return;
  } else if (req.user.U_type == "seller") {
    // console.log(req.body.p_id);
    // console.log(req.user.user_id);

    product.findOneAndDelete(
      { _id: req.body.p_id, seller_id: req.user.user_id },
      (err, find) => {
        if (find) {
          res.status(200).json({ Message: "Product deleted" });
        } else {
          res.status(404).json({ Message: "Product not found" });
        }
      }
    );
  } else {
    res.status(400).json({ Message: "You are not our seller" });
    return;
  }
};

exports.view_all_products = async (req, res, next) => {
  if (req.user.U_type == "seller") {
    if (req.body.title && req.body.category) {
      product.find(
        {
          title: { $regex: new RegExp(req.body.title, "i") },
          category: { $regex: new RegExp(req.body.category, "i") },
          seller_id: req.user.user_id,
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
          seller_id: req.user.user_id,
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
          seller_id: req.user.user_id,
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
      product.find({ seller_id: req.user.user_id }, (err, find) => {
        if (find && find != "") {
          res
            .status(200)
            .json({ Message: "Success all products found", Data: find });
        } else {
          res.status(404).json({ Message: "No record found" });
        }
      });
    }
  }
};


