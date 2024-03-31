import { SequelizeCustomerResponse } from "../../../infrastructure/db/models/customer";
import { SequelizeProductResponse } from "../../../infrastructure/db/models/product";


export class orderAggregateResponse {
    Order: OrderDTO;
    OrderDetails:Array<OrderDetailDTO>;
  }

  export class OrderDTO {
    ID: number;
    Customer: SequelizeCustomerResponse;
    TotalAmount: number;
    Status: number;
    PurchasedDate: Date;
    CreatedDate: Date;
    UpdatedDate: Date;
  }

  export class OrderDetailDTO {
    ID: number;
    OrderId: number;
    Product: SequelizeProductResponse;
    Count: number;
    CreatedDate: Date;
    UpdatedDate: Date;
  }
  
  export default orderAggregateResponse