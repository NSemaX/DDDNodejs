import { SequelizeOrderRequest } from "../../infrastructure/db/models/order";
import { SequelizeOrderDetailRequest } from "../../infrastructure/db/models/orderDetail";
import { IAggregateRoot } from "../seedwork/IAggregateRoot";


export class OrderAggregate implements IAggregateRoot {
    Order: SequelizeOrderRequest;
    OrderDetails:Array<SequelizeOrderDetailRequest>;
  }
  export default OrderAggregate