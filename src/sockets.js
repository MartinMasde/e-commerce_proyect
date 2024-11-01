import { Server } from 'socket.io';
import ProductManager from './dao/managers/ProductManager.js';

const initSocket = (httpServer) => {
    const io = new Server(httpServer);
    console.log('Socket.io initialized');

    const productManager = new ProductManager();

    io.on('connection', async (cliente) => {
        console.log(`Client connected, id ${cliente.id}`);

        // Manejar solicitudes de productos con paginación
        cliente.on('requestProducts', async ({ page = 1, limit = 10 }) => {
            try {
                const products = await productManager.get({ page, limit });
                console.log('Enviando productos:', products); // Para debug
                cliente.emit('updateProducts', products);
            } catch (error) {
                console.error('Error al obtener productos:', error);
                cliente.emit('updateProducts', {status: 'error', error: error.message, payload: [] });
            }
        });

        cliente.on('disconnect', reason => {
            console.log(`Client disconnected: ${reason}`);
        });
    });

    const broadcastProductsUpdate = async () => {
        try {
            const products = await productManager.get({ page: 1, limit: 10 });
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error en broadcastProductsUpdate:', error);
        }
    };

    return { io, broadcastProductsUpdate };
};

export default initSocket;