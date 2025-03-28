import {EventEmitter} from 'events'
import { OrderCreatedDomainEvent } from '../events/orderCreatedDomainEvent';
import { inject } from 'inversify';
import { Types } from '../../../infrastructure/utility/DiTypes';
import { ICustomerRepository } from '../../models/customer/ICustomerRepository';
import { Address } from '../../models/customer/address';


export class orderCreatedDomainEventHandler{
    @inject(Types.CUSTOMER_REPOSITORY)
    private CustomerRepository: ICustomerRepository;

    private eventEmitter: EventEmitter;

   constructor(eventEmitter: EventEmitter){
       this.eventEmitter = eventEmitter;
   }

    orderCreatedDomainEventHandler() {
        console.log('Event FiredUp')

        this.eventEmitter.on('orderCreated', (orderCreatedDomainEvent) => {
            try{
                this.orderReadytoShipping(orderCreatedDomainEvent);
            }
            catch(error){
                console.log('An error occured while perform Route accessed actions')
            }
        });
    }

    private async orderReadytoShipping( orderCreatedDomainEvent: OrderCreatedDomainEvent){
        //An integration event might be fired up here for ex: shipping API.
        const customer = await this.CustomerRepository.getById(orderCreatedDomainEvent.CustomerId);
        const address= Address.create ({ StreetAddress: customer.Address.StreetAddress, City: customer.Address.City, State: customer.Address.State, Zip: customer.Address.Zip });
        
        console.log(`${orderCreatedDomainEvent.OrderId} order belong to the ${orderCreatedDomainEvent.CustomerId} customer is ready to shipping.`)
        console.log(`Customer address: ${address}`)
    
    }

}