import { DatabaseService } from '../db/database.service';
import jwt = require('jsonwebtoken');
import { buildResponse } from '../utils/utils';
import { ResponseResult } from '../utils/models/responseResult';
import { isEmpty } from '../utils/utils';
import { User } from '../user/models/user.model'

import { Stripe } from 'Stripe';

export class PaymentService {
    private db: DatabaseService;
    private stripe = Stripe('sk_test_vVPwzqIESlYJI5no4Xxq6uOV');

    constructor(db) {
        this.db = db;
    }

    async subscribePay(authenticatedUserId: string, json: any): Promise<ResponseResult> {
        try {
            let user: User = await this.db.getItemById('users', authenticatedUserId);
            if(isEmpty(user)) return buildResponse('INVALID_USER', 'error');
            let customer = await this.stripe.customers.create({
                "email": user.email,
                "source": json.token
            });
            if(!customer) return buildResponse('STRIPE_ERROR','error');
            let subscription = await this.stripe.subscriptions.create({
                "customer": customer.id,
                "plan": 'basic'
            });
            if(!subscription) return buildResponse('SUBSCRIPTION_ERROR', 'error');
            user = await this.db.updateItem('users', authenticatedUserId, {'stripeId': customer.id, 'active': true});
            return buildResponse('SUBSCRIPTION_SUCCESSFUL');
        } catch (error){
            console.log(error);
            return Promise.reject(error);
        }
    }

}