import { inject, injectable } from "inversify";
import "reflect-metadata";
import SequelizeOrder, { SequelizeOrderRequest, SequelizeOrderResponse } from '../db/models/order';
import { Order, IOrder } from '../../domain/models/order';

export interface IOrderRepository {
    getAll: () => Promise<Array<SequelizeOrderResponse>>;
    getById: (id: number) => Promise<SequelizeOrderResponse>;
    create: (order: IOrder) => Promise<any>;
    update: (id: number, order: Partial<SequelizeOrderRequest>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}


@injectable()
export class OrderRepository implements IOrderRepository {

    getAll = async (): Promise<Array<SequelizeOrderResponse>> => {
        return SequelizeOrder.findAll()
    }

    getById = async (id: number): Promise<SequelizeOrderResponse> => {
        const item = await SequelizeOrder.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    create = async (payload: IOrder): Promise<any> => {

        const order: SequelizeOrderRequest = 
        { 
            CustomerId:payload.CustomerId,
            TotalAmount:payload.TotalAmount,
            Status:payload.Status,
            PurchasedDate:payload.PurchasedDate
        }
        const item = await SequelizeOrder.create(order)
        return item.ID
    }


    update = async (ID: number, payload: Partial<SequelizeOrderRequest>): Promise<number> => {
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

