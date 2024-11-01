import { Router } from 'express';
import  ProductManager  from '../dao/managers/ProductManager.js';
import { broadcastProductsUpdate } from '../app.js'; // Importamos la función de broadcast para emitir actualizaciones
import { uploader } from '../uploader.js';
import productModel from '../dao/models/product.model.js';

const router = Router();
const controller = new ProductManager();

// GET /api/products: Retorna todos los productos
router.get ('/', async (req, res) => {
    const data = await controller.get();
    res.status(200).send({ error: null, data: data });
});

// GET /api/products/stats: Retorna los productos según filtros, limit, page, sort y query
router.get('/stats/', async (req, res) => {
    const limit = Number.isNaN(parseInt(req.query.limit)) ? 10 : parseInt(req.query.limit);
    const page = Number.isNaN(parseInt(req.query.page)) ? 1 : parseInt(req.query.page);
    const sort = req.query.sort || 'asc'; // Usa 'asc' como valor predeterminado

    // Configuramos el objeto `query` para filtrar según categoría o disponibilidad
    let query = {};
    if (req.query.category) {
        query.category = req.query.category; // Filtra por categoría
    } else if (req.query.availability) {
        query.stock = req.query.availability === 'in-stock' ? { $gt: 0 } : 0; // Filtra por disponibilidad
    }

    try {
        // Ejecutamos la consulta con los parámetros
        const data = await controller.stats(limit, page, query, sort);
        res.status(200).send({ error: null, data });
    } catch (error) {
        res.status(500).send({ error: error.message, data: [] });
    }
});

// POST /api/products: Crea un nuevo producto
router.post ('/', uploader.single('thumbnail'), async (req, res) => {
    const { title, description, code, price, stock, category, thumbnail = [] } = req.body;

    // Validamos que los datos requeridos estén presentes
    if (!title || !description || !code || !price || !stock || !category) {
        res.status(400).send({ error: 'Faltan campos requeridos', data: [] }); 
    }

    const newProduct = { title, description, code, price, stock, category, thumbnail };
    const process = await controller.add(newProduct);

    // Verificar si no hay problema con el process
    if (process) {
        res.status(200).send({ error: null, data: process});

        // Emitir actualización a los clientes conectados al agregar un producto
        broadcastProductsUpdate();

    } else {
        res.status(400).send({ error: 'Error al intentar agregar el producto', data: [] });
    }
});

// PUT /api/products/:pid: Actualiza un producto según su id
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updateFields = req.body;
        
        // Verificamos si el producto existe
        const existingProduct = await productModel.findById(pid);
        if (!existingProduct) {
            return res.status(404).send({ error: 'Producto no encontrado', data: [] });
        }

        // Filtramos solo los campos que vienen en el body
        const updated = {};
        
        // Solo incluimos los campos que existen en el body
        const allowedFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnail'];
        for (const field of allowedFields) {
            if (field in updateFields) {
                updated[field] = updateFields[field];
            }
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            pid,
            updated,
            { new: true }
        );

        if (updatedProduct) {
            broadcastProductsUpdate();
            res.status(200).send({ error: null, data: updatedProduct });
        } else {
            res.status(404).send({ error: 'Error al actualizar el producto', data: [] });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, data: [] });
    }
});

// DELETE /api/products/:pid: Elimina un producto según su id
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;  // Cambiado de req.query a req.params

        // Verificamos si el producto existe y lo eliminamos
        const deletedProduct = await productModel.findByIdAndDelete(pid);

        if (deletedProduct) {
            broadcastProductsUpdate();
            res.status(200).send({ error: null, data: deletedProduct, message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).send({ error: 'Producto no encontrado', data: [] });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message, data: [] });
    }
});

export default router;
