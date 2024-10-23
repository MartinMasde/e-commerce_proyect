// import fs from 'fs';
// import path from 'path';
// import config from '../config.js';
// import { ProductManager } from './ProductManager.js';

// export class ProductManager {
//     constructor() {
//         // Usamos path.join para generar una ruta absoluta al archivo products.json
//         this.file = path.join(config.DIRNAME, 'data', 'products.json');
//     }
//     // Inicializamos el archivo de productos
//     async init() {
//         try {
//             const exists = await fs.promises.access(this.file);
//             console.log('El archivo de productos existe');
//         } catch (err) {
//             console.log('El archivo de productos NO existe. Creando...');
//             await fs.promises.writeFile(this.file, JSON.stringify([]));
//         }
//     }

//     // Metodo para leer los productos del archivo products.json
//     async #readProductsFile() {
//         const products = await fs.promises.readFile(this.file, 'utf-8');
//         return JSON.parse(products);
//     }

//     // Metodo para escribir los productos en el archivo products.json
//     async #writeProductsFile(products) {
//         await fs.promises.writeFile(this.file, JSON.stringify(products, null, 2));
//     }

//     // Metodo para obtener todos los productos
//     async getProducts(limit) {
//         const products = await this.#readProductsFile();
//         return limit ? products.slice(0, limit) : products;
//     }

//     // Metodo para obtener un producto por su id
//     async getProductById(pid) {
//         const products = await this.#readProductsFile();
//         return products.find(p => p.id === pid) || null;
//     }

//     // Metodo para agregar un nuevo producto
//     async addProduct(product) {
//         const products = await this.#readProductsFile();
//         const highestId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
//         const newProduct = {
//             id: highestId + 1,
//             ...product
//         };
//         products.push(newProduct);
//         await this.#writeProductsFile(products);
//         return newProduct;
//     }    

//     // Metodo para actualizar un producto
//     async updateProduct(pid, product) {
//         const products = await this.#readProductsFile();
//         const index = products.findIndex(p => p.id === pid);
//         if (index === -1) {
//             return null;
//         }
//         const updatedProduct = { ...products[index], ...product };
//         products[index] = updatedProduct;
//         await this.#writeProductsFile(products);
//         return updatedProduct;
//     }

//     // Metodo para eliminar un producto
//     async deleteProduct(pid) {
//         const products = await this.#readProductsFile();
//         const productIndex = products.findIndex(p => p.id === pid);

//         if (productIndex === -1) {
//             throw new Error('Producto no encontrado');
//         }
//         const [deletedProduct] = products.splice(productIndex, 1);
//         await this.#writeProductsFile(products);
//         return deletedProduct;
//     }
// }

// import productModel from '../dao/models/product.model.js';
import productModel from '../models/product.model.js';

class ProductManager {
    constructor() {}

    get = async () => {
        try {
            return await productModel.find().lean();
        } catch (error) {
            return error.mesaage;
        }
    }

    add = async (data) => {
        try {
            return await productModel.create(data);
        } catch (error) {
            return error.mesaage;
        }
    }

    update = async ( filter, updated, options ) => {
        try {
            return await productModel.findOneAndUpdate(filter, updated, options);
        } catch (error) {
            return error.mesaage;
        }
    }

    delete = async ( filter, options ) => {
        try {
            return await productModel.findOneAndDelete(filter, options);
        } catch (error) {
            return error.mesaage;
        }
    }

}

export default ProductManager;