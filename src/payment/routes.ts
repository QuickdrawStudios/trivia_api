import * as express from 'express';

import { DatabaseService } from '../db/database.service';

import { PaymentService } from './payment.service';

import { ResponseResult } from '../utils/models/responseResult'

export = (() => {
    let router = express.Router();
    let databaseService = new DatabaseService();
    let paymentService = new PaymentService(databaseService);

    router.post('/subscribe', async (req, res) => {
        try {
            let result: ResponseResult = await paymentService.subscribePay(res.locals.authenticatedUserId, req.body);
            res.send(result);
        } catch (ex) {
            let error = ex;
            res.send(error);
        }
    });

    return router;
})();