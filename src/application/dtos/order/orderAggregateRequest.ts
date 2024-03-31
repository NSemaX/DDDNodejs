
export class orderAggregateRequest  {
  Order: OrderDTO;
  OrderDetails:Array<OrderDetailDTO>;
  }
  export class OrderDTO {
    CustomerId: number;
    PurchasedDate: Date;
  }

  export class OrderDetailDTO {
    ProductId: number;
    Count: number;
  }

  export default orderAggregateRequest