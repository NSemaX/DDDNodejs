import SequelizeConnection from "../SequelizeConnection";
import SequelizeCustomer from "./customerDBModel";
import SequelizeOrder from "./orderDBModel";
import SequelizeOrderDetail from "./orderDetailDBModel";
import SequelizeProduct from "./productDBModel";



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

