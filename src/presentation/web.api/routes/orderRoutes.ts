import express from "express";
import { IOrderController } from "../controllers/orderController";
import { dIContainer } from "../../../infrastructure/config/inversify.config";
import { Types } from "../../../infrastructure/utility/DiTypes";


class OrderRoutes {
  router = express.Router();
  orderController = dIContainer.get<IOrderController>(
    Types.ORDER_CONTROLLER
  );
  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {

    // Retrieve all Orders
    this.router.get("/", this.orderController.getAllOrders);

    // Retrieve a single Order with id
    this.router.get("/:id", this.orderController.getOrderById);
    
    // Retrieve a Orders with customerId
    this.router.get("/customers/:id", this.orderController.getOrdersByCustomerId);

    // Create a new Order
    this.router.post("/", this.orderController.createOrder);

    // Update a Order with id
    this.router.put("/", this.orderController.updateOrder);

    // Delete a Order with id
    this.router.delete("/:id", this.orderController.deleteOrder);

  }
}

export default new OrderRoutes().router;
