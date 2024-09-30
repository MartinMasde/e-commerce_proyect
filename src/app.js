import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

// Configuracion general
import config from './config.js';

// Inicializacion de express
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Server initialization
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
    }
);
