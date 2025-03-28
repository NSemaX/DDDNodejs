import { inject, injectable } from "inversify";
import { Types } from "../../infrastructure/utility/DiTypes";
import { IOrderDetail } from "../aggregates/order/orderDetail";
import { IOrderRepository } from "../aggregates/order/IOrderRepository";
import { IOrderDetailRepository } from "../aggregates/order/IOrderDetailRepository";
import { IOrder } from "../aggregates/order/order";
import Helpers from "../../infrastructure/utility/Helpers";


export interface IOrderDomainService {
  isOrderReachedtheMaxProductCountInADay: (Id: number, OrderDetails: IOrderDetail[]) => Promise<boolean>;
}

@injectable()
export class OrderDomainService implements IOrderDomainService {
  @inject(Types.ORDER_REPOSITORY)
  private orderRepository: IOrderRepository;

  @inject(Types.ORDER_DETAIL_REPOSITORY)
  private OrderDetailRepository: IOrderDetailRepository;

  isOrderReachedtheMaxProductCountInADay = async (Id: number, OrderDetails: IOrderDetail[]): Promise<boolean> => {
    try {
      let result = false;
      const today = new Date();
      let orderItems: IOrder[] = await this.orderRepository.getByCustomerId(Id);
      const orderItemsFiltered = orderItems.filter(
        (item) => today.toDateString() === item.PurchasedDate.toDateString()
      );


      let allOrderDetails: IOrderDetail[] = new Array<IOrderDetail>;
      for (const orderItem of orderItemsFiltered) {
        let orderDetails: IOrderDetail[] = await this.OrderDetailRepository.getByOrderId(orderItem.ID!);
        if (Array.isArray(orderDetails)) {
          orderDetails.forEach(function (value) {
            allOrderDetails.push(value);
        });
        }
      }

      var groupedOrderDetailsDictionary = Helpers.groupBy(allOrderDetails, "ProductId");
      let grouppedOrderDetailItems: IOrderDetail[] = new Array<IOrderDetail>;

      let customerProductTotalCountsinADay: number[] = new Array<number>(); //just for logging purpose

      for (const orderDetailItem of OrderDetails) {
        for (let [key, value] of Object.entries(groupedOrderDetailsDictionary)) {
          console.log(key + ": " + value);
          if (orderDetailItem.ProductId.toString() === key) {
            grouppedOrderDetailItems = value;
            let grouppedProductCount: number = 0;
            grouppedOrderDetailItems.forEach((orderDetail) => {
              grouppedProductCount += orderDetail.Count;
            });

            if (grouppedProductCount + orderDetailItem.Count > 10)
              result = true;
            customerProductTotalCountsinADay.push(grouppedProductCount);
          }
        }

      }
      console.log(customerProductTotalCountsinADay);
      
      return result;
    } catch (ex) {
      throw new Error("Unable to create order");
    }
  };

}

