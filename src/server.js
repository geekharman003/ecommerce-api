import express from "express";
const app = express();

import "dotenv/config.js";

import connectToDB from "./utils/database.js";
import productRoutes from "./routes/product.route.js";
import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/products", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

connectToDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server is runnig on port 3000");
    });
  })
  .catch((err) => console.log("Error connecting with server:", err));
