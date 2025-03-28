import { Model, Sequelize, DataTypes, Optional } from "sequelize";
import { IProduct } from "../../../domain/models/product/product";


class SequelizeProduct extends Model<IProduct> implements IProduct {
    public ID!: number
    public Name!: string
    public Price!: number


    static initModel(sequelize: Sequelize): void {
        SequelizeProduct.init(
            {
                ID: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                Name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                Price: {
                    type: DataTypes.INTEGER
                }
            },
            {
                sequelize,
                timestamps: true,
                tableName: "Products"
            }
        );
    }
}

export default SequelizeProduct