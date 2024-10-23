import userModel from '../models/user.model.js';


class UserController {
    constructor() {}

    get = async () => {
        try {
            return await userModel.find().lean();
            // const regex = /^C/i;
            // return await userModel.find({ lastName: { $regex: regex }}).explain('executionStats');
        } catch (err) {
            return err.message;
        }
    }

    add = async (data) => {
        try {
            return await userModel.create(data);
        } catch (err) {
            return err.message;
        }
    }

    update = async (filter, updated, options) => {
        try {
            return await userModel.findOneAndUpdate(filter, updated, options);
        } catch (err) {
            return err.message;
        }
    }

    delete = async (filter, options) => {
        try {
            return await userModel.findOneAndDelete(filter, options);
        } catch (err) {
            return err.message;
        }
    }
}


export default UserController;
