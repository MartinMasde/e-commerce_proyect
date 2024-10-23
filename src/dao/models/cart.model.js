import mongoose from 'mongoose';
import config from '../../config.js';
import userModel from './user.model.js';

mongoose.pluralize(null);

const collection = config.CARTS_COLLECTION;

const schema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: config.USERS_COLLECTION },
    products: { type: [{ _id: { type: mongoose.Schema.Types.ObjectId,ref: config.PRODUCTS_COLLECTION }, qty: Number }], required: true }
});

schema.pre('find', function() {
    this.populate({ path: 'user', model: 'userModel', select: 'firstName lastName email' });
});

const model = mongoose.model(collection, schema);

export default model;
