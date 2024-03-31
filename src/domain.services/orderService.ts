import { inject, injectable } from "inversify";
import { Types } from "../infrastructure/utility/DiTypes";
import { IOrderRepository } from "../infrastructure/repositories/orderRepository";
import { SequelizeOrderRequest, SequelizeOrderResponse } from "../infrastructure/db/models/order";

export interface IOrderService {

  getOrderById: (Id: number) => Promise<SequelizeOrderResponse>;
  getAllOrders: () => Promise<Array<SequelizeOrderResponse>>;
  createOrder: (order: SequelizeOrderRequest) => Promise<any>;
  updateOrder: (Id: number, order: SequelizeOrderRequest) => Promise<number>;
  deleteOrder: (Id: number) => Promise<boolean>;
}

@injectable()
export class OrderService implements IOrderService {
  @inject(Types.ORDER_REPOSITORY)
  private orderRepository: IOrderRepository;



  getAllOrders = async (): Promise<Array<SequelizeOrderResponse>> => {
    try {
      return this.orderRepository.getAll();
    } catch {
      throw new Error("Unable to get orders");
    }
  };

  getOrderById = async (Id: number): Promise<SequelizeOrderResponse> => {
    try {
      return this.orderRepository.getById(Id);
    } catch {
      throw new Error("Unable to get order");
    }
  };

  createOrder = async (order: SequelizeOrderRequest): Promise<any> => {
    try {
      return this.orderRepository.create(order);
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };

  updateOrder = async (Id: number, order: SequelizeOrderRequest): Promise<number> => {
    try {
      return this.orderRepository.update(Id, order);
    } catch {
      throw new Error("Unable to updated order");
    }
  };

  deleteOrder = async (Id: number,): Promise<boolean> => {
    try {
      return this.orderRepository.delete(Id);
    } catch {
      throw new Error("Unable to delete order");
    }
  };
}

