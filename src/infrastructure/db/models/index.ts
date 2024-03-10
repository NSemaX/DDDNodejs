import SequelizeConnection from "../SequelizeConnection";
import SequelizeCustomer from "./customer";
import SequelizeOrder from "./order";
import SequelizeOrderDetail from "./orderDetail";
import SequelizeProduct from "./product";



const sequelize = SequelizeConnection.getInstance();

// init models
SequelizeCustomer.initModel(sequelize);
SequelizeOrder.initModel(sequelize);
SequelizeOrderDetail.initModel(sequelize);
SequelizeProduct.initModel(sequelize);


// associate models
//Customer.associateModel();
//Order.associateModel();
//OrderDetail.associateModel();


export const db = {
  sequelize,
  SequelizeCustomer,
  SequelizeOrder,
  SequelizeOrderDetail,
  SequelizeProduct
};

export {
  SequelizeCustomer,
  SequelizeOrder,
  SequelizeOrderDetail,
  SequelizeProduct
}

