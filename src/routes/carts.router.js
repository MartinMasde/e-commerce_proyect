import { Router } from 'express';
import CartManager  from '../dao/managers/CartManager.js';
import ProductManager from '../dao/managers/ProductManager.js';

const router = Router();

// // Instanciamos los managers
// const cartManager = new CartManager();
// const productManager = new ProductManager();

// // Inicializamos el manager de cart
// // await cartManager.init();

// // GET /api/carts/:cid - Retorna un carrito por ID
// router.get('/:cid', async (req, res) => {
//     try {
//         const cart = await cartManager.getCartById(req.params.cid);
//         if (!cart) {
//             return res.status(404).json({ error: 'Carrito no encontrado' });
//         }
//         res.json(cart);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al obtener el carrito' });
//     }
// });

// // POST /api/carts - Crea un nuevo carrito
// router.post('/', async (req, res) => {
//     try {
//         const newCart = await cartManager.createCart();
//         res.status(201).json(newCart);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al crear el carrito' });
//     }
// });

// // POST /api/carts/:cid/product/:pid - Agregar un producto al carrito
// router.post('/:cid/product/:pid', async (req, res) => {
//     try {
//         const pid = parseInt(req.params.pid);

//         const product = await productManager.getProductById(pid);

//         if (!product) {
//             return res.status(404).json({ message: 'Producto no encontrado' });
//         }
//         // Verificamos que el carrito exista
//         const cart = await cartManager.getCartById(req.params.cid);
//         if (!cart) {
//             return res.status(404).json({ message: 'Carrito no encontrado' });
//         }
//         // Agregamos el producto al carrito
//         const updatedCart = await cartManager.addProductToCart(req.params.cid, { id: product.id, quantity: 1 });
//         // Devolvemos el carrito actualizado
//         res.json(updatedCart);

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// export default router;


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
router.get ('/:cid', async (req, res) => {
    const { cid } = req.params;
   
    const process = await controller.getOne(cid);

    if (process) {
        res.status(200).send({ error: null, data: process });
    } else {
        res.status(404).send({ error: 'Carrito no encontrado', data: [] });
    }
});

// POST /api/carts - Crea un nuevo carrito
router.post ('/', async (req, res) => {
    const data = req.body;
    const process = await controller.add(data);

    if (process) {
        res.status(201).send({ error: null, data: process });
    } else {
        res.status(500).send({ error: 'Error al crear el carrito', data: [] });
    }
});

// POST /api/carts/:cid/product/:pid - Agregar un producto al carrito
router.post ('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const filter = { _id: cid };
    const updated = { $push: { products: pid } };
    const options = { new: true };

    const process = await controller.add(filter, updated, options);

    if (process) {
        res.status(200).send({ error: null, data: process });
    } else {
        res.status(404).send({ error: 'Producto no encontrado', data: [] });
    }
});

export default router;
