import express from "express";
import { IProductController } from "../controllers/productController";
import { dIContainer } from "../../../infrastructure/config/inversify.config";
import { Types } from "../../../infrastructure/utility/DiTypes";

class ProductRoutes {
  router = express.Router();
  ProductController = dIContainer.get<IProductController>(
    Types.PRODUCT_CONTROLLER
  );
  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {

    // Retrieve all Products
    this.router.get("/", this.ProductController.getAllProducts);

    // Retrieve a single Product with id
    this.router.get("/:id", this.ProductController.getProductById);

    // Create a new Product
    this.router.post("/", this.ProductController.createProduct);

    // Update a Product
    this.router.put("/", this.ProductController.updateProduct);

    // Delete a Product with id
    this.router.delete("/:id", this.ProductController.deleteProduct);

  }
}

export default new ProductRoutes().router;