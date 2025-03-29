import { IAggregateRoot } from "../../seedwork/IAggregateRoot";
import { IOrder } from "./order";
import { IOrderDetail } from "./orderDetail";


  export interface IOrderAggregate extends IAggregateRoot {
    Order: IOrder;
    OrderDetails:Array<IOrderDetail>;
  }

  export class OrderAggregate {
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