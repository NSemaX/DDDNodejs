import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { SequelizeOrderDetail } from '../db/models';
import { SequelizeOrderDetailRequest, SequelizeOrderDetailResponse } from '../db/models/orderDetail';


export interface IOrderDetailRepository {
    getAll: () => Promise<Array<SequelizeOrderDetailResponse>>;
    getById: (id: number) => Promise<SequelizeOrderDetailResponse>;
    getByOrderId: (id: number) => Promise<Array<SequelizeOrderDetailResponse>>;
    create: (orderDetail: SequelizeOrderDetailRequest) => Promise<any>;
    update: (id: number, orderDetail: Partial<SequelizeOrderDetailRequest>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}


@injectable()
export class OrderDetailRepository implements IOrderDetailRepository {

    getAll = async (): Promise<Array<SequelizeOrderDetailResponse>> => {
        return SequelizeOrderDetail.findAll()
    }

    getById = async (id: number): Promise<SequelizeOrderDetailResponse> => {
        const item = await SequelizeOrderDetail.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    getByOrderId = async (key: number): Promise<Array<SequelizeOrderDetailResponse>> => {
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

    create = async (payload: SequelizeOrderDetailRequest): Promise<any> => {
        const item = await SequelizeOrderDetail.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<SequelizeOrderDetailRequest>): Promise<number> => {
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

