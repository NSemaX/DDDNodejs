import { Entity, IEntity } from "../../seedwork/entity";

export interface IProduct extends IEntity {
    Name: string;
    Price: number;
}

export class Product extends Entity<IProduct> {

    private  _Name!: string
    private  _Price!: number

    constructor({ Name, Price }: IProduct, id?: number) {
        super(id);
        this._Name = Name;
        this._Price = Price;
      }
    
      get Name() {
        return this._Name;
      }
    
      get Price() {
        return this._Price;
      }

    
      public static create(props: IProduct, id?: number) {
        return new Product(props, id);
      }
}