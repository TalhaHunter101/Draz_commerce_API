const express = require("express");
const router = express.Router();
const coustomercontroller = require("../controller/coustomer_controller");
const auth = require("../middlewares/auth");
router.use(
  express.urlencoded({
    extended: true,
  })
);
//routing User  to controller
router.get("/view_all_products", coustomercontroller.view_all_products); // generating token
router.post("/add_address", auth, coustomercontroller.add_address); // generating token
router.get("/add_to_cart", auth, coustomercontroller.add_to_cart); // generating token
router.post("/place_order", auth, coustomercontroller.placoder); // generating token

module.exports = router;
