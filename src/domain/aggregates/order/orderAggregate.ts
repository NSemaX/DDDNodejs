import { inject, injectable } from "inversify";
import { IAggregateRoot } from "../../seedwork/IAggregateRoot";
import { IOrder, Order } from "./order";
import { IOrderDetail } from "./orderDetail";
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

       /* calculateTotal(): number {
          return this._OrderDetails.reduce((total, item) => total + item.getTotalPrice(), 0);
        }*/
      
        public static async create(props: IOrderAggregate, id?: number) {          
          const orderAggregate = new OrderAggregate(props, id);

            let  OrderDetails: IOrderDetail[] =new Array<IOrderDetail>;
            for (const orderDetailItem of orderAggregate.OrderDetails) {
              let OrderDetailItem: IOrderDetail = { OrderId: 0, Count:orderDetailItem.Count, ProductId:orderDetailItem.ProductId };
              OrderDetails.push(OrderDetailItem);
            }
            let isReachedMaxProductInADay = await this.orderDomainService.isOrderReachedtheMaxProductCountInADay(orderAggregate.Order.CustomerId,OrderDetails);

            if (!isReachedMaxProductInADay) {
              let TotalAmount = 0;
              let OrderItem: IOrder = { CustomerId: orderAggregate.Order.CustomerId, TotalAmount:TotalAmount, Status: OrderStatus.Created, PurchasedDate: orderAggregate.Order.PurchasedDate };
              let OrderAggregateItemID = await this.orderRepository.create(OrderItem);
              if (OrderAggregateItemID > 0)

                for (const orderDetailItem of orderAggregate.OrderDetails) {
                  let OrderDetailItem: IOrderDetail = { OrderId: OrderAggregateItemID, Count:orderDetailItem.Count, ProductId:orderDetailItem.ProductId };
                  let productItem= await this.ProductRepository.getById(orderDetailItem.ProductId);
                  if (productItem!=null) {
                  TotalAmount += productItem.Price * orderDetailItem.Count;
                  }
                  await this.OrderDetailRepository.create(OrderDetailItem);
                }

              OrderItem.TotalAmount = TotalAmount;
              await this.orderRepository.update(OrderAggregateItemID, OrderItem);
              
              return orderAggregate  
            }
            throw new Error("Unable to create order, reached to max product count in a day.");               
        }
  }