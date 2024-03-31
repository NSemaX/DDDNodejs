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
                this.sendEmail(orderCreatedDomainEvent);
            }
            catch(error){
                console.log('An error occured while perform Route accessed actions')
            }
        });
    }

    private sendEmail( orderCreatedDomainEvent: OrderCreatedDomainEvent){
        console.log(`An email sent to the ${orderCreatedDomainEvent.CustomerId} email address.`)
    }

}