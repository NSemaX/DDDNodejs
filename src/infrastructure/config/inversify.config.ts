import { Container } from "inversify";
import { IOrderRepository } from "../../domain/aggregates/order/IOrderRepository";
import { IOrderDomainService, OrderDomainService } from "../../domain/domain.services/orderDomainService";
import { IOrderApplicationService, OrderApplicationService } from "../../application/application.service/orderApplicationService";
import { IProductRepository } from "../../domain/models/product/IProductRepository";
import { IProductApplicationService, ProductApplicationService } from "../../application/application.service/productApplicationService";
import { IOrderDetailRepository } from "../../domain/aggregates/order/IOrderDetailRepository";
import { ICustomerRepository } from "../../domain/models/customer/ICustomerRepository";
import { CustomerApplicationService, ICustomerApplicationService } from "../../application/application.service/customerApplicationService";
import { EventEmitterService } from "../utility/EventEmitterService";
import { Types } from "../utility/DiTypes";
import { OrderRepository } from "../repositories/orderRepository";
import { ProductRepository } from "../repositories/productRepository";
import { OrderDetailRepository } from "../repositories/orderDetailRepository";
import { CustomerRepository } from "../repositories/customerRepository";
import { IOrderController, OrderController } from "../../presentation/web.api/controllers/orderController";
import { IProductController, ProductController } from "../../presentation/web.api/controllers/productController";
import { CustomerController, ICustomerController } from "../../presentation/web.api/controllers/customerController";


const dIContainer = new Container();


dIContainer.bind<IOrderRepository>(Types.ORDER_REPOSITORY).to(OrderRepository);
dIContainer.bind<IOrderController>(Types.ORDER_CONTROLLER).to(OrderController);
dIContainer.bind<IOrderDomainService>(Types.ORDER_DOMAIN_SERVICE).to(OrderDomainService);
dIContainer.bind<IOrderApplicationService>(Types.ORDER_APPLICATION_SERVICE).to(OrderApplicationService);

dIContainer.bind<IProductRepository>(Types.PRODUCT_REPOSITORY).to(ProductRepository);
dIContainer.bind<IProductApplicationService>(Types.PRODUCT_APPLICATION_SERVICE).to(ProductApplicationService);
dIContainer.bind<IProductController>(Types.PRODUCT_CONTROLLER).to(ProductController);

dIContainer.bind<IOrderDetailRepository>(Types.ORDER_DETAIL_REPOSITORY).to(OrderDetailRepository);


dIContainer.bind<ICustomerRepository>(Types.CUSTOMER_REPOSITORY).to(CustomerRepository);
dIContainer.bind<ICustomerApplicationService>(Types.CUSTOMER_APPLICATION_SERVICE).to(CustomerApplicationService);
dIContainer.bind<ICustomerController>(Types.CUSTOMER_CONTROLLER).to(CustomerController);

dIContainer.bind<EventEmitterService>(Types.EVENT_EMITTER_SERVICE).to(EventEmitterService);

export { dIContainer };