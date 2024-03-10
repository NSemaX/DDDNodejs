import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { SequelizeCustomer } from '../db/models';
import { CustomerRequest, CustomerResponse } from '../db/models/customer';

export interface ICustomerRepository {
    getAll: () => Promise<Array<CustomerResponse>>;
    getById: (id: number) => Promise<CustomerResponse>;
    create: (Customer: CustomerRequest) => Promise<any>;
    update: (id: number, Customer: Partial<CustomerRequest>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}


@injectable()
export class CustomerRepository implements ICustomerRepository {

    getAll = async (): Promise<Array<CustomerResponse>> => {
        return SequelizeCustomer.findAll()
    }

    getById = async (id: number): Promise<CustomerResponse> => {
        const item = await SequelizeCustomer.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    create = async (payload: CustomerRequest): Promise<any> => {
        const item = await SequelizeCustomer.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<CustomerRequest>): Promise<number> => {
        const item = await SequelizeCustomer.findByPk(ID)

        if (!item) {
            throw new Error('not found')
        }

        const updatedItem = await SequelizeCustomer.update(payload, {
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

