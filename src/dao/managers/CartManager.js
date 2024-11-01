import cartModel from '../models/cart.model.js';
import userModel from '../models/user.model.js';


class CartManager {
    constructor() {}

    get = async () => {
        try {
            return await cartModel.find()
            .populate({ path: 'user', model: userModel, select: 'firstName lastName email' })
            .lean();
        } catch (error) {
            return error.message;

        }
    }

    getOne = async (id) => {
        try {
            return await cartModel.findById(id).lean();
        } catch (error) {
            return error.message;
        }
    }

    add = async (data) => {
        try {
            return await cartModel.create(data);
        } catch (error) {
            return error.message;
        }
    }

    update = async (filter, updated, options) => {
        try {
            return await cartModel.findOneAndUpdate(filter, updated, options);
        } catch (error) {
            return error.message;
        }
    }

    delete = async (filter, options) => {
        try {
            return await cartModel.findOneAndDelete(filter, options);
        } catch (error) {
            return error.message;
        }
    }
} 

export default CartManager;