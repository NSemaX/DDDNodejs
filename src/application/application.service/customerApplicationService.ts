import { inject, injectable } from "inversify";
import CustomerCreateRequest from "../dtos/customer/customerCreateRequest";
import CustomerUpdateRequest from "../dtos/customer/customerUpdateRequest";
import CustomerResponse from "../dtos/customer/customerResponse";
import { CustomerCreatedDomainEvent } from "../../domain/domain.events/events/customerCreatedDomainEvent";
import { EventEmitterService } from "../../infrastructure/utility/EventEmitterService";
import { Types } from "../../infrastructure/utility/DiTypes";
import { ICustomerRepository } from "../../domain/models/customer/ICustomerRepository";
import { Address } from "../../domain/models/customer/address";
import { Customer } from "../../domain/models/customer/customer";


export interface ICustomerApplicationService {

  getCustomerById: (Id: number) => Promise<CustomerResponse>;
  getAllCustomers: () => Promise<Array<CustomerResponse>>;
  createCustomer: (Customer: CustomerCreateRequest) => Promise<any>;
  updateCustomer: (Id: number, Customer: CustomerUpdateRequest) => Promise<number>;
  deleteCustomer: (Id: number) => Promise<boolean>;
}

@injectable()
export class CustomerApplicationService implements ICustomerApplicationService {
  @inject(Types.CUSTOMER_REPOSITORY)
  private CustomerRepository: ICustomerRepository;

  @inject(Types.EVENT_EMITTER_SERVICE)
  private eventEmitterService: EventEmitterService;


  getAllCustomers = async (): Promise<Array<CustomerResponse>> => {
    try {
      const customerDBList = await this.CustomerRepository.getAll();

      const customerList = new Array<CustomerResponse>();

      customerDBList.forEach(async (customerItem: any) => {
        const customer: CustomerResponse =
        {
          ID: customerItem.ID,
          Name: customerItem.Name,
          Surname: customerItem.Surname,
          Email: customerItem.Email,
          Status: customerItem.Status,
          Address: { StreetAddress: customerItem.StreetAddress, City: customerItem.City, State: customerItem.State, Zip: customerItem.Zip },
        };
        customerList.push(customer);
      });

      return customerList;
    } catch {
      throw new Error("Unable to get Customers");
    }
  };

  getCustomerById = async (Id: number): Promise<CustomerResponse> => {
    try {
      const customerDB = await this.CustomerRepository.getById(Id);
      const customer: CustomerResponse =
      {
        ID: customerDB.ID!,
        Name: customerDB.Name,
        Surname: customerDB.Surname,
        Email: customerDB.Email,
        Status: customerDB.Status,
        Address: { StreetAddress: customerDB.Address.StreetAddress, City: customerDB.Address.City, State: customerDB.Address.State, Zip: customerDB.Address.Zip },
      };
      return customer;
    } catch {
      throw new Error("Unable to get Customer");
    }
  };

  createCustomer = async (customer: CustomerCreateRequest): Promise<any> => {
    try {
      const customerparam = Customer.create({
        Name: customer.Name,
        Surname: customer.Surname,
        Email: customer.Email,
        Password: customer.Password,
        Status: 1,
        Address: Address.create({
          StreetAddress: customer.Address.StreetAddress,
          City: customer.Address.City,
          State: customer.Address.State,
          Zip: customer.Address.Zip
        })
      })

      const createdCustomer = await this.CustomerRepository.create(customerparam);

      console.log(`Event for ${Customer} customer`)
      const customerCreatedDomainEvent: CustomerCreatedDomainEvent = { CustomerId: createdCustomer.ID, Email: customer.Email };

      const eventEmitter = this.eventEmitterService.getInstance();
      eventEmitter.emit('customerCreated', customerCreatedDomainEvent);

      return createdCustomer;
    } catch (ex) {
      throw new Error(`Unable to create Customer: ${(ex as Error).message}`);
    }
  };

  updateCustomer = async (Id: number, customer: CustomerUpdateRequest): Promise<number> => {
    try {
      const customerparam = Customer.create({
        Name: customer.Name,
        Surname: customer.Surname,
        Email: customer.Email,
        Password: customer.Password,
        Status: 1,
        Address: Address.create({
          StreetAddress: customer.Address.StreetAddress,
          City: customer.Address.City,
          State: customer.Address.State,
          Zip: customer.Address.Zip
        })
      })

      return this.CustomerRepository.update(Id, customerparam);

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

