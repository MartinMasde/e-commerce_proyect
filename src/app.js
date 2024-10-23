import express from "express";
import handlebars from "express-handlebars";
import initSocket from "./sockets.js";
import mongoose from "mongoose";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/users.router.js";

// Configuracion general
import config from "./config.js";

// Inicializacion de express
const app = express();

// Server initialization
const httpServer = app.listen(config.PORT, async () => {
  await mongoose.connect(config.MONGODB_URI);
  console.log(`Server is running on port ${config.PORT} and connected to MongoDB`);
});

// Inicialización de Socket.io
const { io, broadcastProductsUpdate } = initSocket(httpServer);
app.set("socketServer", io);

// Middlewares para manejo de json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/views", viewsRouter);
app.use("/users", usersRouter);

// Exportar la función de broadcast para que esté disponible
export { broadcastProductsUpdate };
