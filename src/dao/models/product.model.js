import mongoose from "mongoose";
import config from "../../config.js";

// Anulamos comportamiento de renombre por defecto de colecciones
mongoose.pluralize(null);

// Mismo nombre que en la base de datos
const collection = config.PRODUCTS_COLLECTION;

// Definimos el esquema de productos
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: false }
});

// Genero el modelo de productos
const model = mongoose.model(collection, productSchema);

export default model;