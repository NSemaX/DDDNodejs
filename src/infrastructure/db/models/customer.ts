import { Model, Sequelize, DataTypes, Optional } from "sequelize";

export interface ISequelizeCustomer {
    ID: number;
    Name: string;
    Surname: string;
    Email: string;
    Password: string;
    Status: number;
}

export interface CustomerRequest extends Optional<ISequelizeCustomer, 'ID'> {}
export interface CustomerResponse extends Required<ISequelizeCustomer> {}

class SequelizeCustomer extends Model<ISequelizeCustomer,CustomerRequest> implements ISequelizeCustomer {
    public ID!: number
    public Name!: string
    public Surname!: string
    public Email!: string
    public Password!: string
    public Status!: number

    static initModel(sequelize: Sequelize): void {
        SequelizeCustomer.init(
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
                Surname: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                Email: {
                    type: DataTypes.STRING
                },
                Password: {
                    type: DataTypes.STRING
                },
                Status: {
                    type: DataTypes.INTEGER
                }
            },
            {
                sequelize,
                timestamps: true,
                tableName: "Customers"
            }
        );
    }
}

export default SequelizeCustomer