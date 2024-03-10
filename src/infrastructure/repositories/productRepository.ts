import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { SequelizeProduct } from '../db/models';
import { ProductRequest, ProductResponse } from '../db/models/product';

export interface IProductRepository {
    getAll: () => Promise<Array<ProductResponse>>;
    getById: (id: number) => Promise<ProductResponse>;
    create: (Product: ProductRequest) => Promise<any>;
    update: (id: number, Product: Partial<ProductRequest>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}


@injectable()
export class ProductRepository implements IProductRepository {

    getAll = async (): Promise<Array<ProductResponse>> => {
        return SequelizeProduct.findAll()
    }

    getById = async (id: number): Promise<ProductResponse> => {
        const item = await SequelizeProduct.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    create = async (payload: ProductRequest): Promise<any> => {
        const item = await SequelizeProduct.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<ProductRequest>): Promise<number> => {
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

