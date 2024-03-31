import { inject, injectable } from "inversify";
import { Types } from "../infrastructure/utility/DiTypes";
import { IOrderRepository } from "../infrastructure/repositories/orderRepository";
import orderAggregateResponse, { OrderDTO, OrderDetailDTO } from "../application/dtos/order/orderAggregateResponse";
import { IOrderDetailRepository } from "../infrastructure/repositories/orderDetailRepository";
import { IProductRepository } from "../infrastructure/repositories/productRepository";
import { ICustomerRepository } from "../infrastructure/repositories/customerRepository";
import OrderAggregate from "../domain/aggregates/orderAggregate";
import orderAggregateRequest from "../application/dtos/order/orderAggregateRequest";
import { SequelizeOrderDetailResponse } from "../infrastructure/db/models/orderDetail";
import { Order } from "../domain/models/order";
import { OrderCreatedDomainEvent } from "../domain.events/events/orderCreatedDomainEvent";
import { EventEmitterService } from "../infrastructure/utility/EventEmitterService";

export interface IOrderAggregateService {

  getOrderAggreateById: (Id: number) => Promise<orderAggregateResponse>;
  createOrderAggreate: (orderAggregateRequest: orderAggregateRequest) => Promise<any>;
}

@injectable()
export class OrderAggregateService implements IOrderAggregateService {

  @inject(Types.ORDER_REPOSITORY)
  private orderRepository: IOrderRepository;

  @inject(Types.ORDER_DETAIL_REPOSITORY)
  private OrderDetailRepository: IOrderDetailRepository;

  @inject(Types.PRODUCT_REPOSITORY)
  private ProductRepository: IProductRepository;

  @inject(Types.CUSTOMER_REPOSITORY)
  private CustomerRepository: ICustomerRepository;

  @inject(Types.EVENT_EMITTER_SERVICE)
  private eventEmitterService: EventEmitterService;

  getOrderAggreateById = async (Id: number): Promise<orderAggregateResponse> => {
    try {
      const orderAggregateResponseItem = new orderAggregateResponse();
      let orderItem = await this.orderRepository.getById(Id);
      let orderDetails: SequelizeOrderDetailResponse[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID);
      orderAggregateResponseItem.OrderDetails = [];


      let OrderDTOItem = new OrderDTO();

      OrderDTOItem.ID = orderItem.ID;
      OrderDTOItem.Customer = await this.CustomerRepository.getById(orderItem.CustomerId);
      OrderDTOItem.TotalAmount = orderItem.TotalAmount;
      OrderDTOItem.Status = orderItem.Status
      OrderDTOItem.PurchasedDate = orderItem.PurchasedDate;

      let OrderDetailDTOItems: Array<OrderDetailDTO> = new Array<OrderDetailDTO>();

      if (Array.isArray(orderDetails))
       // orderDetails.forEach(async (orderDetailItem: any) => {
        for (const orderDetailItem of orderDetails) {
          const OrderDetailDTOItem = new OrderDetailDTO();

          OrderDetailDTOItem.ID = orderDetailItem.ID;
          OrderDetailDTOItem.Product = await this.ProductRepository.getById(orderDetailItem.ProductId);
          OrderDetailDTOItem.Count = orderDetailItem.Count;
          OrderDetailDTOItem.OrderId = orderDetailItem.OrderId;

          OrderDetailDTOItems.push(OrderDetailDTOItem);
        }
        //});

      orderAggregateResponseItem.Order = OrderDTOItem;
      orderAggregateResponseItem.OrderDetails = OrderDetailDTOItems;

      return orderAggregateResponseItem;
    } catch {
      throw new Error("Unable to get order");
    }
  };

  createOrderAggreate = async (orderAggregateRequest: orderAggregateRequest): Promise<any> => {
    try {
      let totalAmount = 0;
      
      if (Array.isArray(orderAggregateRequest.OrderDetails))
        for (const orderDetailItem of orderAggregateRequest.OrderDetails) {
          totalAmount += (await this.ProductRepository.getById(orderDetailItem.ProductId)).Price
        }

        const orderParam = Order.create({
          CustomerId: orderAggregateRequest.Order.CustomerId,
          TotalAmount: totalAmount,
          Status: 1,
          PurchasedDate:orderAggregateRequest.Order.PurchasedDate
        })

      let OrderAggregateItemID = await this.orderRepository.create(orderParam);

      if (OrderAggregateItemID > 0)
        orderAggregateRequest.OrderDetails.forEach(async (orderDetailItem: any) => {
          orderDetailItem.OrderId = OrderAggregateItemID;
          await this.OrderDetailRepository.create(orderDetailItem);
        });

        console.log(`Event for ${orderParam} customer`)
        const orderCreatedDomainEvent: OrderCreatedDomainEvent = { OrderId: OrderAggregateItemID, CustomerId: orderParam.CustomerId };
  
        const eventEmitter = this.eventEmitterService.getInstance();
        eventEmitter.emit('orderCreated', orderCreatedDomainEvent);

      return OrderAggregateItemID;
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };

}

