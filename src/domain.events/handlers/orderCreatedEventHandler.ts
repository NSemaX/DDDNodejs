import {EventEmitter} from 'events'
import { OrderCreatedDomainEvent } from '../events/orderCreatedDomainEvent';

export class orderCreatedDomainEventHandler{

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

    private orderReadytoShipping( orderCreatedDomainEvent: OrderCreatedDomainEvent){
        //An integration event can be fired up here for shipping API.
        console.log(`${orderCreatedDomainEvent.OrderId} order belong to the ${orderCreatedDomainEvent.CustomerId} customer is ready to shipping.`)
    }

}