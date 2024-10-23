import { Router } from 'express';
import { uploader } from '../uploader.js';
import UserController from '../dao/managers/UserManager.js';


const router = Router();

const controller = new UserController();

const auth = (req, res, next) => {
    console.log('Ejecuta el middleware de autenticación de usuario');
    next();
}

// GET /users -> devuelve todos los usuarios
router.get('/', async (req, res) => {
    const data = await controller.get();
    res.status(200).send({ error: null, data: data });
});

// POST /users -> crea un usuario
router.post('/', auth, uploader.single('thumbnail'), async (req, res) => {
    const { firstName, lastName, email, gender, password} = req.body;

    if (firstName != '' && lastName != '' && email != '' && gender != '' && password != '') {
        const newUser = { firstName: firstName, lastName: lastName, email: email, gender: gender, password: password };
        const process = await controller.add(newUser);

        // Verificar resultado de process
        if (process) {
            res.status(200).send({ error: null, data: process, file: req.file });

            const socketServer = req.app.get('socketServer');
            socketServer.emit('new_user', newUser);

        } else {
            res.status(400).send({ error: 'No se pudo agregar el usuario', data: [] });
        }
        
        // res.status(200).send({ error: null, data: process, file: req.file });
    } else {
        res.status(400).send({ error: 'Faltan campos obligatorios', data: [] });
    }
});

// PUT /users/:id -> actualiza un usuario por id
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, gender, password } = req.body;
    const filter = { _id: id };
    const updated = { firstName: firstName, lastName: lastName, email: email, gender: gender, password: password };
    const options = { new: true };

    const process = await controller.update(filter, updated, options);
    
    if (process) {
        res.status(200).send({ error: null, data: process });
    } else {
        res.status(404).send({ error: 'No se encuentra el usuario', data: [] });
    }
});

// DELETE /users/:id -> borra un usuario por id
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const filter = { _id: id };
    const options = {};

    const process = await controller.delete(filter, options);
    
    if (process) {
        res.status(200).send({ error: null, data: 'Usuario borrado' });
    } else {
        res.status(404).send({ error: 'No se encuentra el usuario', data: [] });
    }
});


export default router;
