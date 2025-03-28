import { Model, Sequelize, DataTypes, Optional } from "sequelize";

export interface ISequelizeCustomer {
    ID?: number;
    Name: string;
    Surname: string;
    Email: string;
    Password: string;
    StreetAddress: string;
    City: string;
    State: string;
    Zip: string;
    Status: number;
}

class SequelizeCustomer extends Model<ISequelizeCustomer> implements ISequelizeCustomer {
    public ID!: number
    public Name!: string
    public Surname!: string
    public Email!: string
    public Password!: string
    public StreetAddress!: string;
    public City!: string;
    public State!: string;
    public Zip!: string;
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
                StreetAddress: {
                    type: DataTypes.STRING
                },
                City: {
                    type: DataTypes.STRING
                },
                State: {
                    type: DataTypes.STRING
                },
                Zip: {
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