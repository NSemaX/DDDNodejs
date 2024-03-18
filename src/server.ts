import express, {Express, Request, Response,Application} from 'express';
import SequelizeConnection from './infrastructure/db/SequelizeConnection'
import { db } from "./infrastructure/db/models/index";
import "reflect-metadata";
import { applicationRoutes } from './application/routes';
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger.json";
import { customerCreatedDomainEventHandler } from './domain.events/handlers/customerCreatedEventHandler';
import { EventEmitterService } from './infrastructure/utility/EventEmitterService';

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
  const eventHandler = new customerCreatedDomainEventHandler(eventEmitter.getInstance())
  eventHandler.customerCreatedDomainEventHandler()
  
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

