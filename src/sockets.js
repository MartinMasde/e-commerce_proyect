import { Server } from 'socket.io';
// import { ProductManager } from './managers/ProductManager.js';
import ProductManager from './dao/managers/ProductManager.js';

const initSocket = (httpServer) => {
    const io = new Server(httpServer);
    console.log('Socket.io initialized');

    // Inicialización del manager de productos
    const productManager = new ProductManager(); 
    // productManager.init();
    
    // Evento de conexión de un cliente al socket server
    io.on('connection', async (cliente) => {
        console.log(`Client connected, id ${cliente.id}`);

        // Enviar productos iniciales al cliente
        const products = await productManager.get();
        cliente.emit('updateProducts', products);

        cliente.on('disconnect', reason => {
            console.log(`Client disconnected: ${reason}`);
        });
    });

    // Función para actualizar los productos en tiempo real la uso en el router de productos para emitir la actualización
    const broadcastProductsUpdate = async () => {
        const products = await productManager.get();
        // Emitir actualización a todos los clientes conectados
        io.emit('updateProducts', products);
    };
    // Retornamos el objeto io y la función de broadcast
    return { io, broadcastProductsUpdate };
};

export default initSocket;