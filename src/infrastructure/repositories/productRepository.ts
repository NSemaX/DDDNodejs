import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { SequelizeProduct } from '../db/dbModels';
import { IProductRepository } from '../../domain/models/product/IProductRepository';
import { IProduct } from '../../domain/models/product/product';


@injectable()
export class ProductRepository implements IProductRepository {

    getAll = async (): Promise<Array<IProduct>> => {
        return SequelizeProduct.findAll()
    }

    getById = async (id: number): Promise<IProduct> => {
        const item = await SequelizeProduct.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    create = async (payload: IProduct): Promise<any> => {
        const item = await SequelizeProduct.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<IProduct>): Promise<number> => {
        const item = await SequelizeProduct.findByPk(ID)

        if (!item) {
            throw new Error('not found')
        }

        const updatedItem = await SequelizeProduct.update(payload, {
            where: { ID },
            returning: false

        }).then(([affectedCount]) => ({ affectedCount }));

        return updatedItem.affectedCount
    }

    delete = async (ID: number): Promise<boolean> => {
        const deletedItemCount = await SequelizeProduct.destroy({
            where: { ID }
        })
        if (deletedItemCount==0) {
            throw new Error('not found')
        }
        return !!deletedItemCount
    }

}

