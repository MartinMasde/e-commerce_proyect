import productModel from '../models/product.model.js';

class ProductManager {
    constructor() {}

    get = async (options = { page: 1, limit: 10 }) => {
        try {
            const { page = 1, limit = 10 } = options;
            
            const result = await productModel.paginate(
                {}, // Query vacío para traer todos los productos
                {
                    page,
                    limit,
                    lean: true
                }
            );

            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage
            };
        } catch (error) {
            return {
                status: 'error',
                error: error.message
            };
        }
    }

    getOne = async (id) => {
        try {
            return await productModel.findById(id).lean();
        } catch (error) {
            return error.message;
        }
    }

    add = async (data) => {
        try {
            return await productModel.create(data);
        } catch (error) {
            return error.message;
        }
    }

    update = async (filter, updated, options) => {
        try {
            return await productModel.findOneAndUpdate(filter, updated, options);
        } catch (error) {
            return error.message;
        }
    }

    delete = async (filter, options) => {
        try {
            return await productModel.findOneAndDelete(filter, options);
        } catch (error) {
            return error.message;
        }
    }

    // Retorna los productos según filtros, limit, page, sort y query
    stats = async (limit, page, query, sort) => {
        try {
            const order = sort === 'asc' ? 1 : -1;
            
            return await productModel.paginate(
                query || {},
                {
                    page,
                    limit,
                    sort: { price: order },
                    lean: true
                }
            );
        } catch (error) {
            throw new Error("Error en la consulta de stats: " + error.message);
        }
    };
}

export default ProductManager;
