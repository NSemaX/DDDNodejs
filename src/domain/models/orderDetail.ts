import { Entity } from "../seedwork/entity";

export interface IOrderDetail {
    OrderId: number;
    ProductId: number;
    Count: number;
}

export class OrderDetail extends Entity<IOrderDetail> {
  
    private  _OrderId!: number
    private  _ProductId!: number
    private  _Count!: number

    constructor({ OrderId, ProductId, Count }: IOrderDetail, id?: number) {
        super(id);
        this._OrderId = OrderId;
        this._ProductId = ProductId;
        this._Count = Count;
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
    
      public static create(props: IOrderDetail, id?: number) {
        return new OrderDetail(props, id);
      }
}