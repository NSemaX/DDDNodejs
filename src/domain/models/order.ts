import { Entity } from "../seedwork/entity";

export interface IOrder {
    CustomerId: number;
    TotalAmount: number;
    Status: number;
    PurchasedDate: Date;
}

class Order extends Entity<IOrder> {
    private  _CustomerId!: number
    private  _TotalAmount!: number
    private  _Status!: number
    private  _PurchasedDate!: Date;

    constructor({ CustomerId, TotalAmount, Status, PurchasedDate }: IOrder, id?: number) {
        super(id);
        this._CustomerId = CustomerId;
        this._TotalAmount = TotalAmount;
        this._Status = Status;
        this._PurchasedDate = PurchasedDate;
      }
    
      get CustomerId() {
        return this._CustomerId;
      }
    
      get TotalAmount() {
        return this._TotalAmount;
      }
    
      get Status() {
        return this._Status;
      }

      get PurchasedDate() {
        return this._PurchasedDate;
      }
    
      public static create(props: IOrder, id?: number) {
        return new Order(props, id);
      }
}