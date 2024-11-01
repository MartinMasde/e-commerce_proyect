import { Router } from "express";

const router = Router();

// GET /products - Retorna los productos en la vista home de forma estática
router.get('/', async (req, res) => {
    try {
        const response = await fetch('http://localhost:8080/api/products');
        const products = await response.json();
        res.render('home', { products });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error al cargar los productos.");
    }
});

// GET /products/realTimeProducts - Retorna la vista de productos en tiempo real con paginación 
router.get('/realTimeProducts', (req, res) => {
    const data = {}
    res.status(200).render('realTimeProducts', data);
});

// GET /carts/:cid - Vista de un carrito específico
router.get('/cart/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const response = await fetch(`http://localhost:8080/api/carts/${cid}`);
        const result = await response.json();
        
        if (result.error) {
            return res.status(404).render('error', { error: 'Carrito no encontrado' });
        }

        const cart = result.data;
        res.render('cart', { cart,
            user: cart.user,
            products: cart.products,
            cartId: cid
        });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).render('error', { error: "Error al cargar el carrito." });
    }
});

export default router;