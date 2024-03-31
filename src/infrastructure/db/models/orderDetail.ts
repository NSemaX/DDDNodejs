import { Model, Sequelize, DataTypes, Optional } from "sequelize";

export interface ISequelizeOrderDetail {
    ID: number;
    OrderId: number;
    ProductId: number;
    Count: number;
}

export interface SequelizeOrderDetailRequest extends Optional<ISequelizeOrderDetail, 'ID'> {}
export interface SequelizeOrderDetailResponse extends Required<ISequelizeOrderDetail> {}

class SequelizeOrderDetail extends Model<ISequelizeOrderDetail,SequelizeOrderDetailRequest> implements ISequelizeOrderDetail {
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