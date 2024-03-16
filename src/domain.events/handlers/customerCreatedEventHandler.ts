import {EventEmitter} from 'events'
import { CustomerCreatedDomainEvent } from '../events/customerCreatedDomainEvent';
import { inject } from 'inversify';
import { EventEmitterService } from '../../infrastructure/utility/EventEmitterService';
import { Types } from '../../infrastructure/utility/DiTypes';

export class EventHandlers{

    @inject(Types.EVENT_EMITTER_SERVICE)
    private eventEmitterService: EventEmitterService;

    customerCreatedDomainEventHandler() {
        console.log('Event FiredUp')

        const eventEmitter =this.eventEmitterService.getInstance();

        eventEmitter.on('customerCreated', (customerCreatedDomainEvent) => {
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