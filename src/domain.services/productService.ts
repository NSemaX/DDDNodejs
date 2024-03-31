import { inject, injectable } from "inversify";
import { Types } from "../infrastructure/utility/DiTypes";
import { IProductRepository } from "../infrastructure/repositories/productRepository";
import { SequelizeProductRequest, SequelizeProductResponse } from "../infrastructure/db/models/product";

export interface IProductService {

  getProductById: (Id: number) => Promise<SequelizeProductResponse>;
  getAllProducts: () => Promise<Array<SequelizeProductResponse>>;
  createProduct: (Product: SequelizeProductRequest) => Promise<any>;
  updateProduct: (Id: number, Product: SequelizeProductRequest) => Promise<number>;
  deleteProduct: (Id: number) => Promise<boolean>;
}

@injectable()
export class ProductService implements IProductService {
  @inject(Types.PRODUCT_REPOSITORY)
  private ProductRepository: IProductRepository;



  getAllProducts = async (): Promise<Array<SequelizeProductResponse>> => {
    try {
      return this.ProductRepository.getAll();
    } catch {
      throw new Error("Unable to get Products");
    }
  };

  getProductById = async (Id: number): Promise<SequelizeProductResponse> => {
    try {
      return this.ProductRepository.getById(Id);
    } catch {
      throw new Error("Unable to get Product");
    }
  };

  createProduct = async (Product: SequelizeProductRequest): Promise<any> => {
    try {
      return this.ProductRepository.create(Product);
    } catch (ex) {
      throw new Error("Unable to create Product");
    }
  };

  updateProduct = async (Id: number, Product: SequelizeProductRequest): Promise<number> => {
    try {
      return this.ProductRepository.update(Id, Product);
    } catch {
      throw new Error("Unable to updated Product");
    }
  };

  deleteProduct = async (Id: number,): Promise<boolean> => {
    try {
      return this.ProductRepository.delete(Id);
    } catch {
      throw new Error("Unable to delete Product");
    }
  };
}

