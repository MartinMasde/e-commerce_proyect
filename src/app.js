import express from "express";
import handlebars from "express-handlebars";
import initSocket from "./sockets.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

// Configuracion general
import config from "./config.js";

// Inicializacion de express
const app = express();

// Middlewares para manejo de json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server initialization
const httpServer = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

// // Socket.io initialization
// const socketServer = initSocket(httpServer);
// app.set("socketServer", socketServer);

// Inicialización de Socket.io
const { io, broadcastProductsUpdate } = initSocket(httpServer);
app.set("socketServer", io);

// Configuración de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/views", viewsRouter);

// Exportar la función de broadcast para que esté disponible
export { broadcastProductsUpdate };
