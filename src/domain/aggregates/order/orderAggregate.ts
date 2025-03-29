import { inject, injectable } from "inversify";
import { IAggregateRoot } from "../../seedwork/IAggregateRoot";
import { IOrder, Order } from "./order";
import { IOrderDetail, OrderDetail } from "./orderDetail";
import { Types } from "../../../infrastructure/utility/DiTypes";
import { IOrderDomainService } from "../../domain.services/orderDomainService";
import { IOrderRepository } from "./IOrderRepository";
import { IOrderDetailRepository } from "./IOrderDetailRepository";
import { IProductRepository } from "../../models/product/IProductRepository";
import { OrderStatus } from "./orderStatus";


  export interface IOrderAggregate extends IAggregateRoot {
    Order: IOrder;
    OrderDetails:Array<IOrderDetail>;
  }

  export class OrderAggregate {

    @inject(Types.ORDER_DOMAIN_SERVICE)
    private static orderDomainService: IOrderDomainService;
  
    @inject(Types.ORDER_REPOSITORY)
    private static orderRepository: IOrderRepository;
  
    @inject(Types.ORDER_DETAIL_REPOSITORY)
    private static OrderDetailRepository: IOrderDetailRepository;
  
    @inject(Types.PRODUCT_REPOSITORY)
    private static ProductRepository: IProductRepository;
    
      private  _Order!: IOrder
      private  _OrderDetails!: Array<IOrderDetail>


  
      constructor({ Order, OrderDetails }: IOrderAggregate, id?: number) {
          this._Order = Order;
          this._OrderDetails = OrderDetails;
        }
      
        get Order() {
          return this._Order;
        }
      
        get OrderDetails() {
          return this._OrderDetails;
        }

        calculateTotal(): number {
          return this._OrderDetails.reduce( (total, item) => total + item.getOrderDetailItemPrice?.()!, 0);
        }
      
        public static async create(props: IOrderAggregate, id?: number) {          
          const orderAggregate = new OrderAggregate(props, id);
          return orderAggregate;
        }
  }