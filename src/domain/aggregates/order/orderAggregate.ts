import { Address } from "../../models/customer/address";
import { IAggregateRoot } from "../../seedwork/IAggregateRoot";
import { IOrder } from "./order";
import { IOrderDetail } from "./orderDetail";


  export interface IOrderAggregate extends IAggregateRoot {
    Order: IOrder;
    OrderDetails:Array<IOrderDetail>;
    //ShippingAddress:Address;
  }
  
  export class OrderAggregate {
    
      private  _Order!: IOrder
      private  _OrderDetails!: Array<IOrderDetail>
      private  _ShippingAddress!: Address
  
      constructor({ Order, OrderDetails }: IOrderAggregate, id?: number) {
          this._Order = Order;
          this._OrderDetails = OrderDetails;
          //this._ShippingAddress = ShippingAddress;
        }
      
        get Order() {
          return this._Order;
        }
      
        get OrderDetails() {
          return this._OrderDetails;
        }
       /* get ShippingAddress() {
          return this._ShippingAddress;
        }*/
    
      
        public static create(props: IOrderAggregate, id?: number) {
          return new OrderAggregate(props, id);
        }
  }