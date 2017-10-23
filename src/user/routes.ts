import * as express from 'express';

import { DatabaseService } from '../db/database.service';

import { UserService } from './user.service';

import { User } from './models/user.model';

export = (() => {
    let router = express.Router();
    let databaseService = new DatabaseService();
    let userService = new UserService(databaseService);

    router.post('/user', async (req, res) => {
        try {
            let result = await userService.create(req.body);
            res.send(result);
        } catch (ex) {
            let error = ex;
            res.send(error);
        }
    });

    router.post('/login', async (req, res) => {
        try {
            let result = await userService.authenticate(req.body);
            res.send(result);
        } catch (ex) {
            let error = ex;
            res.send(error);
        }
    });

    router.get('/user', async (req, res) => {
        try {
            let result: User = await userService.read(res.locals.authenticatedUserId);
            res.send(result);
        } catch (ex) {
            let error = ex;
            res.send(error);
        }
    });

    return router;
})();