import {EventEmitter} from 'events'
import { OrderCreatedDomainEvent } from '../events/orderCreatedDomainEvent';
import { ICustomerRepository } from '../../infrastructure/repositories/customerRepository';
import { inject } from 'inversify';
import { Types } from '../../infrastructure/utility/DiTypes';
import { Address } from '../../domain/models/address';

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
        const address= Address.create ({ StreetAddress: customer.StreetAddress, City: customer.City, State: customer.State, Zip: customer.Zip });
        
        console.log(`${orderCreatedDomainEvent.OrderId} order belong to the ${orderCreatedDomainEvent.CustomerId} customer is ready to shipping.`)
        console.log(`Customer address: ${address}`)
    
    }

}