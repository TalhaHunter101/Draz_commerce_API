const express = require("express");
const app = express();
const PORT = 9000;
const mongo = require("./DB/connect");

// rendering routes
app.use("/user", require("./routers/user_routers"));
app.use("/seller", require("./routers/product_routes"));
app.use("/coustomer", require("./routers/coustomer_routers"));
// app.use("/user/bankaccount/transaction", require("./Router/transactionRoutes"));

// Listening on this port
app.listen(PORT, () => {
  console.log(`Server is starting at : ${PORT} `);
});
