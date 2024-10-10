import { Server } from 'socket.io';
import { ProductManager } from './managers/ProductManager.js';

const initSocket = (httpServer) => {
    const io = new Server(httpServer);
    console.log('Socket.io initialized');

    // Inicializamos el ProductManager
    const productManager = new ProductManager(); 
    productManager.init();

    io.on('connection', async (cliente) => {
        console.log(`Client connected, id ${cliente.id}`);

        // Enviar productos iniciales al cliente
        const products = await productManager.getProducts();
        cliente.emit('updateProducts', products);

        cliente.on('disconnect', reason => {
            console.log(`Client disconnected: ${reason}`);
        });
    });

    // Función para actualizar los productos en tiempo real
    const broadcastProductsUpdate = async () => {
        const products = await productManager.getProducts();
        // Emitir actualización a todos los clientes conectados
        io.emit('updateProducts', products);
    };
    // Retornamos el objeto io y la función de broadcast
    return { io, broadcastProductsUpdate };
};

export default initSocket;