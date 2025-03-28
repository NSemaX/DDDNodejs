import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ICustomerRepository } from '../../domain/models/customer/ICustomerRepository';
import SequelizeCustomer, { ISequelizeCustomer } from '../db/dbModels/customerDBModel';
import { Customer, ICustomer } from '../../domain/models/customer/customer';
import { Address } from '../../domain/models/customer/address';



@injectable()
export class CustomerRepository implements ICustomerRepository {

    getAll = async (): Promise<Array<ICustomer>> => {

        const customerItems = await SequelizeCustomer.findAll()
        const customerList = new Array<ICustomer>();
        
        customerItems.forEach(async (customerItem: any) => {
                const customer: ICustomer =
                {
                  ID: customerItem.ID,
                  Name: customerItem.Name,
                  Surname: customerItem.Surname,
                  Password:customerItem.Password,
                  Email: customerItem.Email,
                  Status: customerItem.Status,
                  Address: Address.create({ StreetAddress: customerItem.StreetAddress, City: customerItem.City, State: customerItem.State, Zip: customerItem.Zip }),
                };
                customerList.push(customer);      
            });
    return customerList
}

    getById = async (id: number): Promise<ICustomer> => {
        const customerItem = await SequelizeCustomer.findByPk(id)

        if (!customerItem) {
            throw new Error('not found')
        }
        
        const customer: ICustomer =
        {
          ID: customerItem.ID,
          Name: customerItem.Name,
          Surname: customerItem.Surname,
          Password:customerItem.Password,
          Email: customerItem.Email,
          Status: customerItem.Status,
          Address: Address.create({ StreetAddress: customerItem.StreetAddress, City: customerItem.City, State: customerItem.State, Zip: customerItem.Zip }),
        };

        return customer
    }

    findByEmail = async (email: string) : Promise<any> => {
        const item = await SequelizeCustomer.findOne({
            where: {
              Email: email,
            },
          });
        return item
    }

    create = async (payload: ICustomer): Promise<any> => {

        const customer: ISequelizeCustomer = 
        { 
          Name:payload.Name,
          Surname:payload.Surname,
          Email:payload.Email,
          Password:payload.Password,
          Status:1,
          StreetAddress: payload.Address.StreetAddress,
          City: payload.Address.City , 
          State: payload.Address.State ,
          Zip: payload.Address.Zip
        }

        const item = await SequelizeCustomer.create(customer)
        return item.ID
    }


    update = async (ID: number, payload: Partial<ICustomer>): Promise<number> => {
        const item = await SequelizeCustomer.findByPk(ID)

        if (!item) {
            throw new Error('not found')
        }

        const customer: ISequelizeCustomer = 
        { 
          Name:payload.Name!,
          Surname:payload.Surname!,
          Email:payload.Email!,
          Password:payload.Password!,
          Status:1,
          StreetAddress: payload.Address?.StreetAddress!,
          City: payload.Address?.City! , 
          State: payload.Address?.State! ,
          Zip: payload.Address?.Zip!
        }

        const updatedItem = await SequelizeCustomer.update(customer, {
            where: { ID },
            returning: false

        }).then(([affectedCount]) => ({ affectedCount }));

        return updatedItem.affectedCount
    }

    delete = async (ID: number): Promise<boolean> => {
        const deletedItemCount = await SequelizeCustomer.destroy({
            where: { ID }
        })
        if (deletedItemCount==0) {
            throw new Error('not found')
        }
        return !!deletedItemCount
    }

}

