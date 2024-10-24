// import fs from 'fs';
// import path from 'path';
// // import config from '../config.js';
// import config from '../../config.js';

// export class CartManager {
//     constructor() {
//         // Usamos path.join para generar una ruta absoluta al archivo carts.json
//         this.file = path.join(config.DIRNAME, 'data', 'carts.json');
//     }
//     // Inicializamos el archivo de carritos
//     async init() {
//         try {
//             const exists = await fs.promises.access(this.file);
//             console.log('El archivo de carritos existe');
//         } catch (err) {
//             console.log('El archivo de carritos NO existe. Creando...');
//             await fs.promises.writeFile(this.file, JSON.stringify([]));
//         }
//     }

//     // Metodo para leer los carritos del archivo carts.json
//     async #readCartsFile() {
//         const carts = await fs.promises.readFile(this.file, 'utf-8');
//         return JSON.parse(carts);
//     }

//     // Metodo para escribir los carritos en el archivo carts.json
//     async #writeCartsFile(carts) {
//         await fs.promises.writeFile(this.file, JSON.stringify(carts, null, 2));
//     }

//     // Metodo para crear un nuevo carrito
//     async createCart() {
//         const carts = await this.#readCartsFile();
//         const newCart = {
//             id: String(carts.length + 1),
//             products: []
//         };
//         carts.push(newCart);
//         await this.#writeCartsFile(carts);
//         return newCart;
//     }

//     // Metodo para obtener un carrito por su id
//     async getCartById(cid) {
//         const carts = await this.#readCartsFile();
//         return carts.find(c => c.id === cid) || null;
//     }

//     // Metodo para agregar un producto al carrito
//     async addProductToCart(cid, product) {
//         const carts = await this.#readCartsFile();
//         const cart = carts.find(c => c.id === cid);

//         if (!cart) {
//             throw new Error('Carrito no encontrado');
//         }

//         const existingProduct = cart.products.find(p => p.id === product.id);

//         if (existingProduct) {
//             existingProduct.quantity += product.quantity;
//         } else {
//             cart.products.push(product);
//         }

//         await this.#writeCartsFile(carts);
//         return cart;
//     }
// }

import cartModel from '../models/cart.model.js';
import userModel from '../models/user.model.js';


class CartManager {
    constructor() {}

    get = async () => {
        try {
            return await cartModel.find().lean();
        } catch (error) {
            return error.message;

        }
    }
    // tengo que hacer el endpoint para que me devuelva el carrito de un usuario
    getOne = async (id) => {
        try {
            return await cartModel.findById(id)
            .populate({ path: 'user', model: 'userModel', select: 'firstName lastName email' })
            .lean();
        } catch (error) {
            return error.message;
        }
    }

    add = async (data) => {
        try {
            return await cartModel.create(data);
        } catch (error) {
            return error.message;
        }
    }

    put = async (filter, updated, options) => {
        try {
            return await cartModel.findOneAndUpdate(filter, updated, options);
        } catch (error) {
            return error.message;
        }
    }

    delete = async (filter, options) => {
        try {
            return await cartModel.findOneAndDelete(filter, options);
        } catch (error) {
            return error.message;
        }
    }


} 

export default CartManager;