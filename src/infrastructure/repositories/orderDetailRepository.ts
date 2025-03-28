import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { SequelizeOrderDetail } from '../db/dbModels';
import { IOrderDetail } from '../../domain/aggregates/order/orderDetail';
import { IOrderDetailRepository } from '../../domain/aggregates/order/IOrderDetailRepository';


@injectable()
export class OrderDetailRepository implements IOrderDetailRepository {

    getAll = async (): Promise<Array<IOrderDetail>> => {
        return SequelizeOrderDetail.findAll()
    }

    getById = async (id: number): Promise<IOrderDetail> => {
        const item = await SequelizeOrderDetail.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    getByOrderId = async (key: number): Promise<Array<IOrderDetail>> => {
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

    

    create = async (payload: IOrderDetail): Promise<any> => {
        const item = await SequelizeOrderDetail.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<IOrderDetail>): Promise<number> => {
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

