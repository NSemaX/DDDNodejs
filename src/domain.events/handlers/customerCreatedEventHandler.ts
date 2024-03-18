import {EventEmitter} from 'events'
import { CustomerCreatedDomainEvent } from '../events/customerCreatedDomainEvent';

export class customerCreatedDomainEventHandler{

   private eventEmitter: EventEmitter;

   constructor(eventEmitter: EventEmitter){
       this.eventEmitter = eventEmitter;
   }

    customerCreatedDomainEventHandler() {
        console.log('Event FiredUp')

        this.eventEmitter.on('customerCreated', (customerCreatedDomainEvent) => {
            try{
                this.sendEmail(customerCreatedDomainEvent);
            }
            catch(error){
                console.log('An error occured while perform Route accessed actions')
            }
        });
    }

    private sendEmail( customerCreatedDomainEvent: CustomerCreatedDomainEvent){
        console.log(`An email sent to the ${customerCreatedDomainEvent.Email} email address.`)
    }

}