export interface Product {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Add your properties here
}

export interface ProductCreateInput {
  name: string;
  // Add your input properties here
}

export interface ProductUpdateInput {
  id: string;
  name?: string;
  // Add your update properties here
}

export type ProductStatus = 'active' | 'inactive' | 'pending';

export interface ProductService {
  create(input: ProductCreateInput): Promise<Product>;
  update(input: ProductUpdateInput): Promise<Product>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
}

export default Product;
