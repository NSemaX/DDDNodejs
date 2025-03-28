import { Model, Sequelize, DataTypes, Optional } from "sequelize";
import { IOrderDetail } from "../../../domain/aggregates/order/orderDetail";


class SequelizeOrderDetail extends Model<IOrderDetail> implements IOrderDetail {
    public ID!: number
    public OrderId!: number
    public ProductId!: number
    public Count!: number

    static initModel(sequelize: Sequelize): void {
        SequelizeOrderDetail.init(
            {
                ID: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                OrderId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                ProductId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                Count: {
                    type: DataTypes.INTEGER
                }
            },
            {
                sequelize,
                timestamps: true,
                tableName: "OrderDetails"
            }
        );
    }
}

export default SequelizeOrderDetail