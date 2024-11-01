import { Router } from 'express';
import CartManager  from '../dao/managers/CartManager.js';
import ProductManager from '../dao/managers/ProductManager.js';
import cartModel from '../dao/models/cart.model.js';
import userModel from '../dao/models/user.model.js';
import productModel from '../dao/models/product.model.js';

const router = Router();

// Instanciamos los managers
const controller = new CartManager();
const productManager = new ProductManager();

// GET /api/carts - Retorna todos los carritos
router.get ('/', async (req, res) => {
    const process = await controller.get();

    if (process) {
        res.status(200).send({ error: null, data: process });
    } else {
        res.status(404).send({ error: 'Carritos no encontrados', data: [] });
    }
});

// GET /api/carts/:cid - Retorna un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        
        const cart = await cartModel.findById(cid);

        if (!cart) {
            return res.status(404).send({ 
                error: 'Carrito no encontrado', data: [] });
        }

        res.status(200).send({ error: null, data: cart });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, data: [] });
    }
});

// POST /api/carts/ - Crea un nuevo carrito 
router.post('/', async (req, res) => {
    try {
        const { user } = req.body;
        
        if (!user) {
            return res.status(400).send({ error: 'Se requiere el ID del usuario', data: [] });
        }

        // Verificamos si el usuario existe
        const userExists = await userModel.findById(user);
        if (!userExists) {
            return res.status(404).send({ error: 'Usuario no encontrado', data: [] });
        }

        // Creamos el nuevo carrito usando el modelo de Mongoose
        const newCart = new cartModel({
            user: user,
            products: []
        });

        // Guardamos el carrito en la base de datos
        const savedCart = await newCart.save();

        res.status(201).send({ error: null, data: savedCart });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, data: [] });
    }
});

// POST /api/carts/:cid/product/:pid - Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        
        // Verificamos si el producto existe 
        const product = await productModel.findById(pid);
        if (!product) {
            return res.status(404).send({ error: 'Producto no encontrado', data: [] });
        }

        // Buscamos y actualizamos el carrito
        const cart = await cartModel.findOneAndUpdate(
            { 
                _id: cid,
                'products._id': pid 
            },
            { 
                $inc: { 'products.$.qty': 1 }
            },
            {  new: true }
        );

        if (!cart) {
            // Si no existe el producto en el carrito, lo agregamos
            const updatedCart = await cartModel.findByIdAndUpdate(
                cid,
                {
                    $push: {
                        products: {
                            _id: pid,
                            qty: 1
                        }
                    }
                },
                { new: true }
            );

            if (!updatedCart) {
                return res.status(404).send({ error: 'Carrito no encontrado', data: [] });
            }

            return res.status(200).send({ error: null, data: updatedCart });
        }

        res.status(200).send({ error: null, data: cart });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, data: [] });
    }
});

// DELETE /api/carts/:cid/product/:pid - Eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // Verificamos si el carrito existe
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado', data: [] });
        }
        // Buscamos y eliminamos el producto del carrito usando $pull
        const updatedCart = await cartModel.findByIdAndUpdate(
            cid,
            {
                $pull: {
                    products: { _id: pid }
                }
            },
            { new: true }
        );

        if (!updatedCart) {
            return res.status(404).send({ error: 'Error al eliminar el producto del carrito', data: [] });
        }

        res.status(200).send({ error: null, data: updatedCart });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, data: [] });
    }
});

// DELETE /api/carts/:cid - Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        // Verificamos si el carrito existe y actualizamos vaciando el array de productos
        const updatedCart = await cartModel.findByIdAndUpdate( cid, { $set: { products: [] } }, { new: true });

        if (!updatedCart) {
            return res.status(404).send({ error: 'Carrito no encontrado', data: [] });
        }

        res.status(200).send({ error: null, data: updatedCart });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, data: [] });
    }
});

// PUT /api/carts/:cid - Actualizar el carrito con un nuevo array de productos
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        // Validar que products sea un array
        if (!Array.isArray(products)) {
            return res.status(400).send({ error: 'El campo products debe ser un array', data: [] });
        }

        // Validar que cada producto tenga el formato correcto
        for (const product of products) {
            if (!product._id || !product.qty || product.qty < 0) {
                return res.status(400).send({ error: 'Cada producto debe tener _id y qty (cantidad) válida', data: [] });
            }

            // Verificar que el producto existe
            const productExists = await productModel.findById(product._id);
            if (!productExists) {
                return res.status(404).send({ error: `Producto con ID ${product._id} no encontrado`, data: [] });
            }
        }

        // Actualizar el carrito con el nuevo array de productos
        const updatedCart = await cartModel.findByIdAndUpdate( cid, { $set: { products: products } }, { new: true } );

        if (!updatedCart) {
            return res.status(404).send({ error: 'Carrito no encontrado', data: [] });
        }

        res.status(200).send({ error: null, data: updatedCart });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, data: [] });
    }
});

// PUT api/carts/:cid/products/:pid - Actualizar la cantidad de un producto en el carrito
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { qty } = req.body;  // Cambiamos quantity por qty para coincidir con nuestro modelo

        // Validamos que se haya proporcionado una cantidad
        if (!qty || qty < 0) {
            return res.status(400).send({ error: 'Se requiere una cantidad válida (mayor o igual a 0)', data: [] });
        }

        // Buscamos el carrito y actualizamos la cantidad del producto
        const cart = await cartModel.findOneAndUpdate(
            { 
                _id: cid, 
                'products._id': pid  // Buscamos el producto dentro del array de productos
            },
            { 
                $set: { 
                    'products.$.qty': qty  // Actualizamos la cantidad del producto encontrado
                } 
            },
            { 
                new: true  // Para que devuelva el documento actualizado
            }
        );

        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado o producto no existe en el carrito', data: [] });
        }
        res.status(200).send({ error: null, data: cart });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, data: [] });
    }
});


export default router;
