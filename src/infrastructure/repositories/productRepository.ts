import { Op } from 'sequelize'
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { SequelizeProduct } from '../db/models';
import { SequelizeProductRequest, SequelizeProductResponse } from '../db/models/product';

export interface IProductRepository {
    getAll: () => Promise<Array<SequelizeProductResponse>>;
    getById: (id: number) => Promise<SequelizeProductResponse>;
    create: (product: SequelizeProductRequest) => Promise<any>;
    update: (id: number, product: Partial<SequelizeProductRequest>) => Promise<number>;
    delete: (id: any) => Promise<boolean>;
}


@injectable()
export class ProductRepository implements IProductRepository {

    getAll = async (): Promise<Array<SequelizeProductResponse>> => {
        return SequelizeProduct.findAll()
    }

    getById = async (id: number): Promise<SequelizeProductResponse> => {
        const item = await SequelizeProduct.findByPk(id)

        if (!item) {
            throw new Error('not found')
        }

        return item
    }

    create = async (payload: SequelizeProductRequest): Promise<any> => {
        const item = await SequelizeProduct.create(payload)
        return item.ID
    }


    update = async (ID: number, payload: Partial<SequelizeProductRequest>): Promise<number> => {
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

