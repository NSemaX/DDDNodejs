import { Model, Sequelize, DataTypes, Optional } from "sequelize";
import { IOrder } from "../../../domain/aggregates/order/order";


class SequelizeOrder extends Model<IOrder> implements IOrder {
    public ID!: number
    public CustomerId!: number
    public TotalAmount!: number
    public Status!: number
    public PurchasedDate!: Date;


    static initModel(sequelize: Sequelize): void {
        SequelizeOrder.init(
            {
                ID: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                CustomerId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                TotalAmount: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                Status: {
                    type: DataTypes.INTEGER
                },
                PurchasedDate:  DataTypes.DATE
            },
            {
                sequelize,
                timestamps: true,
                tableName: "Orders"
            }
        );
    }
}

export default SequelizeOrder