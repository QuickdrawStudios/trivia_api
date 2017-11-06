"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const utils_2 = require("../utils/utils");
const Stripe_1 = require("Stripe");
class PaymentService {
    constructor(db) {
        this.stripe = Stripe_1.Stripe('sk_test_vVPwzqIESlYJI5no4Xxq6uOV');
        this.db = db;
    }
    subscribePay(authenticatedUserId, json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.db.getItemById('users', authenticatedUserId);
                if (utils_2.isEmpty(user))
                    return utils_1.buildResponse('INVALID_USER', 'error');
                let customer = yield this.stripe.customers.create({
                    "email": user.email,
                    "source": json.token
                });
                if (!customer)
                    return utils_1.buildResponse('STRIPE_ERROR', 'error');
                let subscription = yield this.stripe.subscriptions.create({
                    "customer": customer.id,
                    "plan": 'basic'
                });
                if (!subscription)
                    return utils_1.buildResponse('SUBSCRIPTION_ERROR', 'error');
                user = yield this.db.updateItem('users', authenticatedUserId, { 'stripeId': customer.id, 'active': true });
                return utils_1.buildResponse('SUBSCRIPTION_SUCCESSFUL');
            }
            catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        });
    }
}
exports.PaymentService = PaymentService;
