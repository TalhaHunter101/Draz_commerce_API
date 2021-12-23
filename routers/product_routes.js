const express = require("express");
const router = express.Router();
const productcontroller = require("../controller/product_controller");
const auth = require("../middlewares/auth");
router.use(
  express.urlencoded({
    extended: true,
  })
);
//routing User  to controller
router.post("/addproduct", auth, productcontroller.add_product); // generating token
router.delete("/deleteproduct", auth, productcontroller.delete_product); // generating token
router.get("/viewallproduct", auth, productcontroller.view_all_products); // generating token

module.exports = router;
