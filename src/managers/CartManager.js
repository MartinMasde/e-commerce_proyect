import fs from 'fs';
import path from 'path';
import config from '../config.js';

export class CartManager {
    constructor() {
        // Usamos path.join para generar una ruta absoluta al archivo carts.json
        this.file = path.join(config.DIRNAME, 'data', 'carts.json');
    }
    // Inicializamos el archivo de carritos
    async init() {
        try {
            const exists = await fs.promises.access(this.file);
            console.log('El archivo de carritos existe');
        } catch (err) {
            console.log('El archivo de carritos NO existe. Creando...');
            await fs.promises.writeFile(this.file, JSON.stringify([]));
        }
    }

    // Metodo para leer los carritos del archivo carts.json
    async #readCartsFile() {
        const carts = await fs.promises.readFile(this.file, 'utf-8');
        return JSON.parse(carts);
    }

    // Metodo para escribir los carritos en el archivo carts.json
    async #writeCartsFile(carts) {
        await fs.promises.writeFile(this.file, JSON.stringify(carts, null, 2));
    }

    // Metodo para crear un nuevo carrito
    async createCart() {
        const carts = await this.#readCartsFile();
        const newCart = {
            id: String(carts.length + 1),
            products: []
        };
        carts.push(newCart);
        await this.#writeCartsFile(carts);
        return newCart;
    }

    // Metodo para obtener un carrito por su id
    async getCartById(cid) {
        const carts = await this.#readCartsFile();
        return carts.find(c => c.id === cid) || null;
    }

    // Metodo para agregar un producto al carrito
    async addProductToCart(cid, product) {
        const carts = await this.#readCartsFile();
        const cart = carts.find(c => c.id === cid);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const existingProduct = cart.products.find(p => p.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            cart.products.push(product);
        }

        await this.#writeCartsFile(carts);
        return cart;
    }
}