import { inject, injectable } from "inversify";
import OrderResponse, { OrderDetailResponseDTO, OrderItemResponse, OrderResponseDTO } from "../dtos/order/orderResponse";
import OrderCreateRequest, { OrderCreateRequestDetailDTO } from "../dtos/order/orderCreateRequest";
import OrderUpdateRequest from "../dtos/order/orderUpdateRequest";
import { IOrderDomainService } from "../../domain/domain.services/orderDomainService";
import { IOrderRepository } from "../../domain/aggregates/order/IOrderRepository";
import { IOrderDetailRepository } from "../../domain/aggregates/order/IOrderDetailRepository";
import { Types } from "../../infrastructure/utility/DiTypes";
import { ICustomerRepository } from "../../domain/models/customer/ICustomerRepository";
import { IOrderDetail, OrderDetail } from "../../domain/aggregates/order/orderDetail";
import { IOrder } from "../../domain/aggregates/order/order";
import { IProductRepository } from "../../domain/models/product/IProductRepository";
import { OrderStatus } from "../../domain/aggregates/order/orderStatus";
import { CustomerResponse } from "../dtos/customer/customerResponse";
import { EventEmitterService } from "../../infrastructure/utility/EventEmitterService";
import { OrderCreatedDomainEvent } from "../../domain/domain.events/events/orderCreatedDomainEvent";
import { IOrderAggregate, OrderAggregate } from "../../domain/aggregates/order/orderAggregate";



export interface IOrderApplicationService {
  getAllOrders: () => Promise<Array<OrderItemResponse>>;
  getOrderById: (Id: number) => Promise<OrderResponse>;
  getOrdersByCustomerId: (Id: number) => Promise<Array<OrderResponse>>;
  createOrder: (orderAggregateRequest: OrderCreateRequest) => Promise<any>;
  updateOrder: (Id: number, order: OrderUpdateRequest) => Promise<number>;
  deleteOrder: (Id: number) => Promise<boolean>;
}

@injectable()
export class OrderApplicationService implements IOrderApplicationService {

  @inject(Types.ORDER_DOMAIN_SERVICE)
  private orderDomainService: IOrderDomainService;

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


  getAllOrders = async (): Promise<Array<OrderItemResponse>> => {
    try {
      return this.orderRepository.getAll();
    } catch {
      throw new Error("Unable to get orders");
    }
  };

  getOrderById = async (Id: number): Promise<OrderResponse> => {
    try {
      let orderItem = await this.orderRepository.getById(Id);
      let orderDetails: IOrderDetail[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID!);
      let orderAggregateResponseItem = await this.prepareOrderAggregate(orderItem, orderDetails);
      return orderAggregateResponseItem;
    } catch {
      throw new Error("Unable to get order");
    }
  };

  getOrdersByCustomerId = async (CustomerId: number): Promise<Array<OrderResponse>> => {
    try {
      let orderAggregateResponseList: OrderResponse[] = new Array<OrderResponse>();
      let orderItems: IOrder[] = await this.orderRepository.getByCustomerId(CustomerId);

      for (const orderItem of orderItems) {
        let orderDetails: IOrderDetail[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID!);
        let orderAggregateResponseItem = await this.prepareOrderAggregate(orderItem, orderDetails);
        orderAggregateResponseList.push(orderAggregateResponseItem);
      }
      return orderAggregateResponseList;
    } catch {
      throw new Error("Unable to get order");
    }
  };

  createOrder = async (orderCreateRequest: OrderCreateRequest): Promise<any> => {
    try {
      //mapping
      const orderAggregateItem: IOrderAggregate =
      {
        Order: {
          CustomerId: orderCreateRequest.Order.CustomerId,
          TotalAmount: 0,
          Status: 0,
          PurchasedDate: orderCreateRequest.Order.PurchasedDate
        },
        OrderDetails: orderCreateRequest.OrderDetails,
      };
      //execute domain rules
      const orderAggregate = await OrderAggregate.create(orderAggregateItem);

     //execute application rules
     //orderDetail Mapping
      let OrderDetails: IOrderDetail[] = new Array<IOrderDetail>;
      for (const orderDetailItem of orderAggregate.OrderDetails) {
        let OrderDetailItem: IOrderDetail = { OrderId: 0, Count: orderDetailItem.Count, ProductId: orderDetailItem.ProductId };
        OrderDetails.push(OrderDetailItem);
      }
      let isReachedMaxProductInADay = await this.orderDomainService.isOrderReachedtheMaxProductCountInADay(orderAggregate.Order.CustomerId, OrderDetails);

      if (!isReachedMaxProductInADay) {
        //create orderItem
        let TotalAmount = orderAggregate.calculateTotal();
        let OrderItem: IOrder = { CustomerId: orderAggregate.Order.CustomerId, TotalAmount: TotalAmount, Status: OrderStatus.Created, PurchasedDate: orderAggregate.Order.PurchasedDate };
        let OrderAggregateItemID = await this.orderRepository.create(OrderItem);

        if (OrderAggregateItemID > 0)
          for (const orderDetailItem of orderAggregate.OrderDetails) {
            let OrderDetailItem: IOrderDetail = { OrderId: OrderAggregateItemID, Count: orderDetailItem.Count, ProductId: orderDetailItem.ProductId };
        //create orderDetailItems 
            await this.OrderDetailRepository.create(OrderDetailItem);
          }
        //fire domain events
        console.log(`Event for ${orderAggregate} orderAggregate`)
        const orderCreatedDomainEvent: OrderCreatedDomainEvent = { OrderId: orderAggregate.Order.ID, CustomerId: orderAggregate.Order.CustomerId };

        const eventEmitter = this.eventEmitterService.getInstance();
        eventEmitter.emit('orderCreated', orderCreatedDomainEvent);

        return OrderAggregateItemID;
      }
      throw new Error("Unable to create order, reached to max product count in a day.");
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };

  updateOrder = async (Id: number, orderUpdateRequest: OrderUpdateRequest): Promise<number> => {
    try {
      return this.orderRepository.update(Id, orderUpdateRequest);
    } catch {
      throw new Error("Unable to updated order");
    }
  };

  deleteOrder = async (Id: number,): Promise<boolean> => {
    try {
      let orderDetails: IOrderDetail[] = await this.OrderDetailRepository.getByOrderId(Id);
      for (const orderDetailItem of orderDetails) {
        let deletedOrderDetailItemId = await this.OrderDetailRepository.delete(orderDetailItem.ID);
      }
      let deletedOrderItemId = this.orderRepository.delete(Id);
      return deletedOrderItemId
    } catch {
      throw new Error("Unable to delete order");
    }
  };

  prepareOrderAggregate = async (order: IOrder, orderDetails: Array<IOrderDetail>): Promise<OrderResponse> => {
    const orderResponseItem = new OrderResponse();
    orderResponseItem.OrderDetails = [];

    let OrderDTOItem = new OrderResponseDTO();

    OrderDTOItem.ID = order.ID!;
    const customerDB = await this.CustomerRepository.getById(order.CustomerId);
    const customerResp: CustomerResponse =
    {
      ID: customerDB.ID!,
      Name: customerDB.Name,
      Surname: customerDB.Surname,
      Email: customerDB.Email,
      Status: customerDB.Status,
      Address: { StreetAddress: customerDB.Address.StreetAddress, City: customerDB.Address.City, State: customerDB.Address.State, Zip: customerDB.Address.Zip },
    };
    OrderDTOItem.Customer = customerResp;
    OrderDTOItem.TotalAmount=order.TotalAmount;
    OrderDTOItem.Status = order.Status
    OrderDTOItem.PurchasedDate = order.PurchasedDate;

    let OrderDetailDTOItems: Array<OrderDetailResponseDTO> = new Array<OrderDetailResponseDTO>();

    if (Array.isArray(orderDetails))
      for (const orderDetailItem of orderDetails) {
        const OrderDetailDTOItem = new OrderDetailResponseDTO();
        OrderDetailDTOItem.ID = orderDetailItem.ID!;
        OrderDetailDTOItem.Product = await this.ProductRepository.getById(orderDetailItem.ProductId);
        OrderDetailDTOItem.Count = orderDetailItem.Count;
        OrderDetailDTOItem.OrderId = orderDetailItem.OrderId!;
        OrderDetailDTOItems.push(OrderDetailDTOItem);
      }

    orderResponseItem.Order = OrderDTOItem;
    orderResponseItem.OrderDetails = OrderDetailDTOItems;

    return orderResponseItem;
  }

}

