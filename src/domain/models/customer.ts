import { IAggregateRoot } from "../seedwork/IAggregateRoot";
import { Entity } from "../seedwork/entity";

export interface ICustomer {
    Name: string;
    Surname: string;
    Email: string;
    Password: string;
    Status: number;
}

class Customer extends Entity<ICustomer> {
    private _Name!: string;
    private _Surname!: string;
    private _Email!: string;
    public _Password!: string
    public _Status!: number

    constructor({ Name, Surname, Email, Password, Status}: ICustomer, id?: number) {
        super(id);
        this._Name = Name;
        this._Surname = Surname;
        this._Email = Email;
        this._Password = Password;
        this._Status = Status;
      }

      get Name() {
        return this._Name;
      }
    
      get Surname() {
        return this._Surname;
      }
    
      get Email() {
        return this._Email;
      }

      get Password() {
        return this._Password;
      }
    
      get Status() {
        return this._Status;
      }

    
      public static create(props: ICustomer, id?: number) {
        return new Customer(props, id);
      }
}