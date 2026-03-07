import express from "express";
const app = express();

import "dotenv/config.js";

import connectToDB from "./utils/database.js";
import productRoutes from "./routes/product.route.js";
import adminRoutes from "./routes/admin.route.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

app.use("/api/products", productRoutes);
app.use("/api/admin/products", adminRoutes);

connectToDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server is runnig on port 3000");
    });
  })
  .catch((err) => console.log("Error connecting with server:", err));
