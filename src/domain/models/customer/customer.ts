import { Entity, IEntity } from "../../seedwork/entity";
import { Address } from "./address";

export interface ICustomer extends IEntity {
    Name: string;
    Surname: string;
    Email: string;
    Password: string;
    Address: Address;
    Status: number;
}

export class Customer extends Entity<ICustomer> {

    private static EMAIL_REGEX = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i
    private static MIN_PASSWORD_LENGTH = 4;
    private _Name!: string;
    private _Surname!: string;
    private _Email!: string;
    public _Password!: string
    public _Address!: Address
    public _Status!: number

    constructor({ Name, Surname, Email, Password, Address,Status}: ICustomer, id?: number) {
        super(id);
        this.validateEmail(Email);
        this.validatePassword(Password);
        this._Name = Name;
        this._Surname = Surname;
        this._Email = Email;
        this._Password = Password;
        this._Address= Address;
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

      get Address() {
        return this._Address;
      }
    
      get Status() {
        return this._Status;
      }

      private validateEmail(email: string) {
        const isValid = Customer.EMAIL_REGEX.test(email);
    
        if(!isValid){
          throw new Error('Invalid Email')
        }
      }

      protected validatePassword(password: string) {
        if(password.length < Customer.MIN_PASSWORD_LENGTH) {
          throw new Error('Invalid Password Length')
        }
      }
    
      public static create(props: ICustomer, id?: number) {
        return new Customer(props, id)
      }
}