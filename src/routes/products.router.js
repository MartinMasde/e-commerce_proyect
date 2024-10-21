import { Router } from 'express';
import  ProductManager  from '../dao/managers/ProductManager.js';
import { broadcastProductsUpdate } from '../app.js'; // Importamos la función de broadcast para emitir actualizaciones
import { uploader } from '../uploader.js';

const router = Router();
const controller = new ProductManager();

// Instanciamos el manager de productos
const productManager = new ProductManager();

// Inicializamos el manager de productos
// await productManager.init();


router.get ('/', async (req, res) => {
    const data = await controller.get();
    res.status(200).send({ error: null, data: data });
});

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

router.put ('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, stock, category, thumbnail = [] } = req.body;
    const filter = { _id: id };
    const updated = { title, description, code, price, stock, category, thumbnail };
    const options = { new: true };

    const process = await controller.update(filter, updated, options);

    if (process) {
        res.status(200).send({ error: null, data: process });
    } else {
        res.status(404).send({ error: 'Producto no encontrado', data: [] });
    }
});

router.delete ('/:id', async (req, res) => {
    const { id } = req.params;
    const filter = { _id: id };
    const options = { };

    const process = await controller.delete(filter, options);

    if (process) {
        broadcastProductsUpdate();
        res.status(200).send({ error: null, data: process });
    } else {
        res.status(404).send({ error: 'Producto no encontrado', data: [] });
    }
});


// GET /api/products: Retorna todos los productos
// router.get('/', async (req, res) => {
//     const limit = parseInt(req.query.limit);
//     try {
//         let products = await productManager.getProducts();
//         if (limit) {
//             return res.json(products.slice(0, parseInt(limit)));
//         }
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al obtener los productos' });
//     }
// });

// GET /api/products/:pid: Retorna un producto según su id
// router.get('/:pid', async (req, res) => {
//     const pid = parseInt(req.params.pid);
//     try {
//         const product = await productManager.getProductById(pid);
//     if (!product) {
//         return res.status(404).json({ error: 'Producto no encontrado' });
//     }
//     res.json(product);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al obtener el producto' });
//     }
// });

// POST /api/products: Crea un nuevo producto
// router.post('/', async (req, res) => {
//     const { title, description, code, price, stock, category, thumbnail = [] } = req.body;

//     // Validamos que los datos requeridos estén presentes
//     if (!title || !description || !code || !price || !stock || !category) {
//         return res.status(400).json({ error: 'Faltan campos requeridos' });
//     }

//     const newProduct = await productManager.addProduct({
//         title,
//         description,
//         code,
//         price,
//         status: true, // Valor por defecto
//         stock,
//         category,
//         thumbnail
//     });
//     // Emitir actualización a los clientes conectados al agregar un producto
//     broadcastProductsUpdate();
//     res.status(201).json({ message: 'Producto agregado correctamente', newProduct });
// });

// PUT /api/products/:pid: Actualiza un producto según su id
// router.put('/:pid', (req, res) => {
//     const pid = parseInt(req.params.pid);
//     const { title, description, code, price, status, stock, category, thumbnail } = req.body;

//     const productManager = new ProductManager();
//     productManager.init();

//     const product = productManager.getProductById(pid);

//     if (product === -1) {
//         return res.status(404).json({ error: 'Producto no encontrado' });
//     }

//     // se acutalizan los datos presentes en el body. Si un campo no está presente, se mantiene el valor actual
//     const updatedProduct = {
//         ...product,  // Mantenemos los datos originales
//         title: title || product.title,
//         description: description || product.description,
//         code: code || product.code,
//         status: status !== undefined ? status : product.status,
//         price: price || product.price,
//         stock: stock || product.stock,
//         category: category || product.category,
//         thumbnail: thumbnail || product.thumbnail
//     };

//     productManager.updateProduct(pid, updatedProduct);

//     res.status(200).json({ message: 'Producto actualizado correctamente', updatedProduct });
//     }  
// );
    
// DELETE /api/products/:pid: Elimina un producto según su id
// router.delete("/:pid", async (req, res) => {
//   const pid = parseInt(req.params.pid);

//   const productManager = new ProductManager();
//   productManager.init();

//   try {
//     const deletedProduct = await productManager.deleteProduct(pid);
//     // Emitir actualización a los clientes conectados al eliminar un producto
//     broadcastProductsUpdate(); 
//     res.json({
//       message: `Producto con id ${pid} eliminado correctamente`,
//       product: deletedProduct,
//     });
//   } catch (error) {
//     if (error.message === "Producto no encontrado") {
//       return res.status(404).json({ error: "Producto no encontrado" });
//     } else {
//       res.status(500).json({ error: "Error al eliminar el producto" });
//     }
//   }
// });

export default router;

        