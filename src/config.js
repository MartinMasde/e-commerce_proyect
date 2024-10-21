import * as url from 'url';

const config = {
    PORT: 8080,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/uploads` },
    // MONGODB_URI: 'mongodb://127.0.0.1:27017/coder70275', // coder7027, ahi va el nombre de la base de datos de mongodb
    MONGODB_URI: 'mongodb+srv://martinmasdeayala:tincho77@cluster0.pvejc3v.mongodb.net/e-commerce_proyect'

};

export default config;