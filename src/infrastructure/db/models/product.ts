import { Model, Sequelize, DataTypes, Optional } from "sequelize";

export interface ISequelizeProduct {
    ID: number;
    Name: string;
    Price: number;
}

export interface SequelizeProductRequest extends Optional<ISequelizeProduct, 'ID'> {}
export interface SequelizeProductResponse extends Required<ISequelizeProduct> { } //CreatedAt: Date, UpdatedAt: Date

class SequelizeProduct extends Model<ISequelizeProduct,SequelizeProductRequest> implements ISequelizeProduct {
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