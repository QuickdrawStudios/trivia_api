"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const database_service_1 = require("../db/database.service");
const payment_service_1 = require("./payment.service");
module.exports = (() => {
    let router = express.Router();
    let databaseService = new database_service_1.DatabaseService();
    let paymentService = new payment_service_1.PaymentService(databaseService);
    router.post('/subscribe', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield paymentService.subscribePay(res.locals.authenticatedUserId, req.body);
            res.send(result);
        }
        catch (ex) {
            let error = ex;
            res.send(error);
        }
    }));
    return router;
})();
