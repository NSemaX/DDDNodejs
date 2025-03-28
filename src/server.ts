import express, {Express, Request, Response,Application} from 'express';
import SequelizeConnection from './infrastructure/db/SequelizeConnection'
import { db } from "./infrastructure/db/dbModels/index";
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./presentation/web.api/swagger.json";
import { customerCreatedDomainEventHandler } from './domain/domain.events/handlers/customerCreatedEventHandler';
import { EventEmitterService } from './infrastructure/utility/EventEmitterService';
import { orderCreatedDomainEventHandler } from './domain/domain.events/handlers/orderCreatedEventHandler';
import { applicationRoutes } from './presentation/web.api/routes';



const app: Express = express();
const port = 3000;

(async () => {
    await SequelizeConnection.connect();
  
    // once connection is authenticated, sequelize will sync the database models
    // force flag is used to drop the database and create the database again
    db.sequelize.sync({
        force: false 
      })
  
  })();

  //initialize domain events
  const eventEmitter : EventEmitterService= new EventEmitterService();
  const eventHandlerForcustomerCreatedDomainEvent = new customerCreatedDomainEventHandler(eventEmitter.getInstance())
  eventHandlerForcustomerCreatedDomainEvent.customerCreatedDomainEventHandler()
  const eventHandlerFororderCreatedDomainEvent = new orderCreatedDomainEventHandler(eventEmitter.getInstance())
  eventHandlerFororderCreatedDomainEvent.orderCreatedDomainEventHandler()
  
app.get('/', (req: Request, res: Response)=>{
    res.send('Hello, this is Express + TypeScript');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', applicationRoutes);


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.listen(port, ()=> {
console.log(`[Server]: I am running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    SequelizeConnection.close(); 
  });

