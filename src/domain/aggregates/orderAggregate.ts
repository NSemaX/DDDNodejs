import { OrderRequest } from "../../infrastructure/db/models/order";
import { OrderDetailRequest } from "../../infrastructure/db/models/orderDetail";
import { IAggregateRoot } from "../seedwork/IAggregateRoot";


export class OrderAggregate implements IAggregateRoot {
    Order: OrderRequest;
    OrderDetails:Array<OrderDetailRequest>;
  }
  export default OrderAggregate