import { Model, Sequelize, DataTypes, Optional } from "sequelize";


export interface ISequelizeOrder {
    ID: number;
    CustomerId: number;
    TotalAmount: number;
    Status: number;
    PurchasedDate: Date;
}


export interface OrderRequest extends Optional<ISequelizeOrder, 'ID'> {}
export interface OrderResponse extends Required<ISequelizeOrder> {}

class SequelizeOrder extends Model<ISequelizeOrder,OrderRequest> implements ISequelizeOrder {
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