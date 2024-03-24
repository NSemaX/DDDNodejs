import { inject, injectable } from "inversify";
import { Types } from "../infrastructure/utility/DiTypes";
import { ICustomerRepository } from "../infrastructure/repositories/customerRepository";
import { CustomerCreatedDomainEvent } from "../domain.events/events/customerCreatedDomainEvent";
import { EventEmitterService } from "../infrastructure/utility/EventEmitterService";
import GetCustomerResponse from "../application/dtos/customer/getCustomerResponse";
import CreateCustomerRequest from "../application/dtos/customer/createCustomerRequest";
import { SequelizeCustomer } from "../infrastructure/db/models";
import UpdateCustomerRequest from "../application/dtos/customer/updateCustomerRequest";
import { CustomerRequest } from "../infrastructure/db/models/customer";

export interface ICustomerService {

  getCustomerById: (Id: number) => Promise<GetCustomerResponse>;
  getAllCustomers: () => Promise<Array<GetCustomerResponse>>;
  createCustomer: (Customer: CreateCustomerRequest) => Promise<any>;
  updateCustomer: (Id: number, Customer: UpdateCustomerRequest) => Promise<number>;
  deleteCustomer: (Id: number) => Promise<boolean>;
}

@injectable()
export class CustomerService implements ICustomerService {
  @inject(Types.CUSTOMER_REPOSITORY)
  private CustomerRepository: ICustomerRepository;

  @inject(Types.EVENT_EMITTER_SERVICE)
  private eventEmitterService: EventEmitterService;


  getAllCustomers = async (): Promise<Array<GetCustomerResponse>> => {
    try {
      const customerDBList= await this.CustomerRepository.getAll();

      const customerList = new Array<GetCustomerResponse>();

      customerDBList.forEach(async (customerItem: any) => {
        const customer: GetCustomerResponse = 
        { 
          ID:customerItem.ID,
          Name:customerItem.Name,
          Surname:customerItem.Surname,
          Email:customerItem.Email,
          Status:customerItem.Status,
          Address:{StreetAddress: customerItem.StreetAddress, City: customerItem.City , State: customerItem.State ,Zip: customerItem.Zip},
          };
      });

      return customerList;
    } catch {
      throw new Error("Unable to get Customers");
    }
  };

  getCustomerById = async (Id: number): Promise<GetCustomerResponse> => {
    try {
      const customerDB= await this.CustomerRepository.getById(Id);
      const customer: GetCustomerResponse = 
      { 
        ID:customerDB.ID,
        Name:customerDB.Name,
        Surname:customerDB.Surname,
        Email:customerDB.Email,
        Status:customerDB.Status,
        Address:{StreetAddress: customerDB.StreetAddress, City: customerDB.City , State: customerDB.State ,Zip: customerDB.Zip},
      };
      return customer;
    } catch {
      throw new Error("Unable to get Customer");
    }
  };

  createCustomer = async (Customer: CreateCustomerRequest): Promise<any> => {
    try {

      const customerDB= new SequelizeCustomer();
      customerDB.Name=Customer.Name;
      customerDB.Surname=Customer.Surname;
      customerDB.Email=Customer.Email;
      customerDB.Password=Customer.Password;
      customerDB.StreetAddress=Customer.Address.StreetAddress;
      customerDB.City=Customer.Address.City;
      customerDB.State=Customer.Address.State;
      customerDB.Zip=Customer.Address.Zip;
      customerDB.Status=1;

      const createdCustomer=await this.CustomerRepository.create(customerDB);
      
      console.log(`Event for ${Customer} customer`)
      const customerCreatedDomainEvent: CustomerCreatedDomainEvent = {CustomerId:createdCustomer.ID, Email: Customer.Email}; 
 
      const eventEmitter =this.eventEmitterService.getInstance();
      eventEmitter.emit('customerCreated', customerCreatedDomainEvent);

      return createdCustomer;
    } catch (ex) {
      throw new Error("Unable to create Customer");
    }
  };

  updateCustomer = async (Id: number, Customer: UpdateCustomerRequest): Promise<number> => {
    try {
      const customer: CustomerRequest = 
      { 
        ID:Customer.ID,
        Name:Customer.Name,
        Surname:Customer.Surname,
        Email:Customer.Email,
        Password:Customer.Password,
        Status:Customer.Status,
        StreetAddress: Customer.Address.StreetAddress,
        City: Customer.Address.City , 
        State: Customer.Address.State ,
        Zip: Customer.Address.Zip
      }

      return this.CustomerRepository.update(Id, customer);
      
    } catch {
      throw new Error("Unable to updated Customer");
    }
  };

  deleteCustomer = async (Id: number,): Promise<boolean> => {
    try {
      return this.CustomerRepository.delete(Id);
    } catch {
      throw new Error("Unable to delete Customer");
    }
  };
}

