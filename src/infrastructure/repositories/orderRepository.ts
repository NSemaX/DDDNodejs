import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import SequelizeOrder, { OrderRequest, OrderResponse } from '../db/models/order';

export interface IOrderRepository {
    getAll: () => Promise<Array<OrderResponse>>;
    getById: (id: number) => Promise<OrderResponse>;
    create: (order: OrderRequest) => Promise<any>;
    update: (id: number, order: Partial<OrderRequest>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}


@injectable()
export class OrderRepository implements IOrderRepository {

    getAll = async (): Promise<Array<OrderResponse>> => {
        return SequelizeOrder.findAll()
    }

    getById = async (id: number): Promise<OrderResponse> => {
        const item = await SequelizeOrder.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    create = async (payload: OrderRequest): Promise<any> => {
        const item = await SequelizeOrder.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<OrderRequest>): Promise<number> => {
        const item = await SequelizeOrder.findByPk(ID)

        if (!item) {
            throw new Error('not found')
        }

        const updatedItem = await SequelizeOrder.update(payload, {
            where: { ID },
            returning: false

        }).then(([affectedCount]) => ({ affectedCount }));

        return updatedItem.affectedCount
    }

    delete = async (ID: number): Promise<boolean> => {
        const deletedItemCount = await SequelizeOrder.destroy({
            where: { ID }
        })
        if (deletedItemCount==0) {
            throw new Error('not found')
        }
        return !!deletedItemCount
    }

}

