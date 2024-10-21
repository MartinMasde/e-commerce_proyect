import mongoose from "mongoose";

mongoose.pluralize(null);

// Mismo nombre que la base de datos
const collection = 'carts';

const cartSchema = new mongoose.Schema({
    products: { type: Array, required: true }
});

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;