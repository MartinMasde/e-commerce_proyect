import { Router } from "express";

const router = Router();

// GET /products - Retorna los productos en la vista home
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

// GET /products/realTimeProducts - Retorna la vista de productos en tiempo real
router.get('/realTimeProducts', (req, res) => {
    const data = {}
    res.status(200).render('realTimeProducts', data);
    // res.status(200).render('realTimeProducts');
} );

export default router;