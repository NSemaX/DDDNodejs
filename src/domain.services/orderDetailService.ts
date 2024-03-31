import { inject, injectable } from "inversify";
import { Types } from "../infrastructure/utility/DiTypes";
import { IOrderDetailRepository } from "../infrastructure/repositories/orderDetailRepository";
import { SequelizeOrderDetailRequest, SequelizeOrderDetailResponse } from "../infrastructure/db/models/orderDetail";

export interface IOrderDetailService {

  getOrderDetailById: (Id: number) => Promise<SequelizeOrderDetailResponse>;
  getAllOrderDetails: () => Promise<Array<SequelizeOrderDetailResponse>>;
  createOrderDetail: (OrderDetail: SequelizeOrderDetailRequest) => Promise<any>;
  updateOrderDetail: (Id: number, OrderDetail: SequelizeOrderDetailRequest) => Promise<number>;
  deleteOrderDetail: (Id: number) => Promise<boolean>;
}

@injectable()
export class OrderDetailService implements IOrderDetailService {
  @inject(Types.ORDER_DETAIL_REPOSITORY)
  private OrderDetailRepository: IOrderDetailRepository;



  getAllOrderDetails = async (): Promise<Array<SequelizeOrderDetailResponse>> => {
    try {
      return this.OrderDetailRepository.getAll();
    } catch {
      throw new Error("Unable to get OrderDetails");
    }
  };

  getOrderDetailById = async (Id: number): Promise<SequelizeOrderDetailResponse> => {
    try {
      return this.OrderDetailRepository.getById(Id);
    } catch {
      throw new Error("Unable to get OrderDetail");
    }
  };

  createOrderDetail = async (OrderDetail: SequelizeOrderDetailRequest): Promise<any> => {
    try {
      return this.OrderDetailRepository.create(OrderDetail);
    } catch (ex) {
      throw new Error("Unable to create OrderDetail");
    }
  };

  updateOrderDetail = async (Id: number, OrderDetail: SequelizeOrderDetailRequest): Promise<number> => {
    try {
      return this.OrderDetailRepository.update(Id, OrderDetail);
    } catch {
      throw new Error("Unable to updated OrderDetail");
    }
  };

  deleteOrderDetail = async (Id: number,): Promise<boolean> => {
    try {
      return this.OrderDetailRepository.delete(Id);
    } catch {
      throw new Error("Unable to delete OrderDetail");
    }
  };
}

