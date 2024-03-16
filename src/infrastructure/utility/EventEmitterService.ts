import { EventEmitter } from 'events'
import { injectable } from 'inversify';

@injectable()
export class EventEmitterService {

    private static instance: EventEmitter;

     getInstance(): EventEmitter {

            if (!EventEmitterService.instance) {
                EventEmitterService.instance = new EventEmitter();
              }
              return EventEmitterService.instance;

    }
}