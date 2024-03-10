import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { SequelizeOrderDetail } from '../db/models';
import { OrderDetailRequest, OrderDetailResponse } from '../db/models/orderDetail';


export interface IOrderDetailRepository {
    getAll: () => Promise<Array<OrderDetailResponse>>;
    getById: (id: number) => Promise<OrderDetailResponse>;
    getByOrderId: (id: number) => Promise<Array<OrderDetailResponse>>;
    create: (OrderDetail: OrderDetailRequest) => Promise<any>;
    update: (id: number, OrderDetail: Partial<OrderDetailRequest>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}


@injectable()
export class OrderDetailRepository implements IOrderDetailRepository {

    getAll = async (): Promise<Array<OrderDetailResponse>> => {
        return SequelizeOrderDetail.findAll()
    }

    getById = async (id: number): Promise<OrderDetailResponse> => {
        const item = await SequelizeOrderDetail.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    getByOrderId = async (key: number): Promise<Array<OrderDetailResponse>> => {
        const items = await SequelizeOrderDetail.findAll({
            where: {
                OrderId: key,
            },
        })
        
        if (!items) {
            throw new Error('not found')
        }

        return items
    }

    create = async (payload: OrderDetailRequest): Promise<any> => {
        const item = await SequelizeOrderDetail.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<OrderDetailRequest>): Promise<number> => {
        const item = await SequelizeOrderDetail.findByPk(ID)

        if (!item) {
            throw new Error('not found')
        }

        const updatedItem = await SequelizeOrderDetail.update(payload, {
            where: { ID },
            returning: false

        }).then(([affectedCount]) => ({ affectedCount }));

        return updatedItem.affectedCount
    }

    delete = async (ID: number): Promise<boolean> => {
        const deletedItemCount = await SequelizeOrderDetail.destroy({
            where: { ID }
        })
        if (deletedItemCount==0) {
            throw new Error('not found')
        }
        return !!deletedItemCount
    }

}

