import { inject, injectable } from "inversify";
import { Types } from "../infrastructure/utility/DiTypes";
import { ICustomerRepository } from "../infrastructure/repositories/customerRepository";
import { CustomerRequest, CustomerResponse } from "../infrastructure/db/models/customer";
import { CustomerCreatedDomainEvent } from "../domain.events/events/customerCreatedDomainEvent";
import { EventEmitterService } from "../infrastructure/utility/EventEmitterService";
import EventEmitter from "events";

export interface ICustomerService {

  getCustomerById: (Id: number) => Promise<CustomerResponse>;
  getAllCustomers: () => Promise<Array<CustomerResponse>>;
  createCustomer: (Customer: CustomerRequest) => Promise<any>;
  updateCustomer: (Id: number, Customer: CustomerRequest) => Promise<number>;
  deleteCustomer: (Id: number) => Promise<boolean>;
}

@injectable()
export class CustomerService implements ICustomerService {
  @inject(Types.CUSTOMER_REPOSITORY)
  private CustomerRepository: ICustomerRepository;

  @inject(Types.EVENT_EMITTER_SERVICE)
  private eventEmitterService: EventEmitterService;

  private eventEmitter: EventEmitter

  getAllCustomers = async (): Promise<Array<CustomerResponse>> => {
    try {
      return this.CustomerRepository.getAll();
    } catch {
      throw new Error("Unable to get Customers");
    }
  };

  getCustomerById = async (Id: number): Promise<CustomerResponse> => {
    try {
      return this.CustomerRepository.getById(Id);
    } catch {
      throw new Error("Unable to get Customer");
    }
  };

  createCustomer = async (Customer: CustomerRequest): Promise<any> => {
    try {
      const createdCustomer=this.CustomerRepository.create(Customer);
      
      console.log(`Event for ${createdCustomer} customer`)
      const customerCreatedDomainEvent: CustomerCreatedDomainEvent = {CustomerId:Customer.ID, Email: Customer.Email}; 
 
      const eventEmitter =this.eventEmitterService.getInstance();
      eventEmitter.emit('customerCreated', customerCreatedDomainEvent);

      return createdCustomer;
    } catch (ex) {
      throw new Error("Unable to create Customer");
    }
  };

  updateCustomer = async (Id: number, Customer: CustomerRequest): Promise<number> => {
    try {
      return this.CustomerRepository.update(Id, Customer);
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

