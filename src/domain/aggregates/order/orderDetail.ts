import { inject } from "inversify";
import { Entity, IEntity } from "../../seedwork/entity";
import { Types } from "../../../infrastructure/utility/DiTypes";
import { IProductRepository } from "../../models/product/IProductRepository";

export interface IOrderDetail extends IEntity {
    getOrderDetailItemPrice?(): number;
    OrderId?: number;
    ProductId: number;
    Count: number;
}

export class OrderDetail extends Entity<IOrderDetail> {
  
    @inject(Types.PRODUCT_REPOSITORY)
    private  ProductRepository: IProductRepository;
  
    private  _OrderId!: number
    public  _ProductId!: number
    private  _Count!: number

    constructor(private orderDetail: IOrderDetail, id?: number) {
        super(id);
        this._OrderId = orderDetail.OrderId!;
        this._ProductId = orderDetail.ProductId;
        this._Count = orderDetail.Count;
      }
    
      get OrderId() {
        return this._OrderId;
      }
    
      get ProductId() {
        return this._ProductId;
      }
    
      get Count() {
        if (this._Count <= 0)
        {
          throw new Error('Invalid number of units');
        }
        return this._Count;
      }

       async getOrderDetailItemPrice(): Promise<number> {
        return ((await this.ProductRepository.getById(this.orderDetail.ProductId)).Price * this.orderDetail.Count);
      }
    
      public static create(props: IOrderDetail, id?: number) {
        return new OrderDetail(props, id);
      }
}
