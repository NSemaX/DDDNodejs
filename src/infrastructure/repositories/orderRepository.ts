import { inject, injectable } from "inversify";
import "reflect-metadata";
import {  IOrder } from '../../domain/aggregates/order/order';
import { IOrderRepository } from "../../domain/aggregates/order/IOrderRepository";
import { SequelizeOrder } from "../db/dbModels";


@injectable()
export class OrderRepository implements IOrderRepository {

    getAll = async (): Promise<Array<IOrder>> => {
        return SequelizeOrder.findAll()
    }

    getById = async (id: number): Promise<IOrder> => {
        const item = await SequelizeOrder.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    getByCustomerId = async (customerId: number): Promise<Array<IOrder>> => {

        const customerOrders = await SequelizeOrder.findAll({
          where: {
            CustomerId: customerId,
          },
        });

      if (!customerOrders) {
          throw new Error('not found')
      }

      return customerOrders
  }

    create = async (payload: IOrder): Promise<any> => {

        const order: IOrder = 
        { 
            CustomerId:payload.CustomerId,
            TotalAmount:payload.TotalAmount,
            Status:payload.Status,
            PurchasedDate:payload.PurchasedDate
        }
        const item = await SequelizeOrder.create(order)
        return item.ID
    }


    update = async (ID: number, payload: Partial<IOrder>): Promise<number> => {
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

