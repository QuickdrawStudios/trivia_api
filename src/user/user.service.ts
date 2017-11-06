import { User } from './models/user.model';
import { DatabaseService } from '../db/database.service';
import jwt = require('jsonwebtoken');
import { buildResponse } from '../utils/utils';
import { ResponseResult } from '../utils/models/responseResult';

export class UserService {
    private db: DatabaseService;

    constructor(db) {
        this.db = db;
    }

    async create(json: any): Promise<ResponseResult> {
        try {
            let newUser: User = {
                email: json.email,
                password: json.password,
                active: false,
                stripeId: ''
            }
            let user = await this.db.insertItem("users", newUser);
            if(!user) return buildResponse("REGISTRATION_FAILED", "error");
            let token = jwt.sign({ user }, 'my_secret_key', {'expiresIn': '4hr'});
            return buildResponse(token);
        } catch (error){
            console.log(error);
            return Promise.reject(error);
        }
    }

    async read(userId: string): Promise<ResponseResult> {
        try {
            if(!userId) return buildResponse('INVALID_USER','error')
            let user: User = await this.db.getItemById("users", userId);
            if(!user) return buildResponse("INVALID_USER", "error");
            return buildResponse(user);
        } catch (error){
            console.log(error);
            return Promise.reject(error);
        }
    }

    async getAuthenticatedUser(id: string): Promise<ResponseResult> {
        try {
            let user = await this.db.getItemById("users", id);
            if(!user) return buildResponse("INVALID_USER", "error");
            return buildResponse(user);
        } catch (error){
            console.log(error);
            return Promise.reject(error);
        }
    }

    async authenticate(json: any): Promise<ResponseResult>{
        try {
            let user: User = await this.db.lookupItem('users', {"email": json.email});
            if(!user) return buildResponse("INVALID_USER", "error");
            if(user.password != json.password) return buildResponse("INCORRECT PASSWORD", "error");
            let token = jwt.sign({ user }, 'my_secret_key', {'expiresIn': '4hr'});
            let authResponse = { "token": token, "active": user.active };
            return buildResponse(authResponse);
        } catch (error){
            console.log(error);
            return Promise.reject(error);
        }
    }

    async isAuthenticated(req, res, next, db: DatabaseService){
        try {            
            let token = req.headers.authorization;
            if(token){
                let decodedJwt = jwt.verify(token, 'my_secret_key');
                let user = await this.db.getItemById("users", decodedJwt.user._id);
                if (!user) return res.send(buildResponse("NOT_AUTHORIZED", "error"));
                res.locals.authenticatedUserId = decodedJwt.user._id;
                return next();
            } else {
                if((req.path == '/login' || req.path == '/user') && req.method == 'POST') return next();
                return res.send(buildResponse("NOT_AUTHROIZED", "error"));
            }
        }
        catch (error){
            console.log(error);
            return res.send(buildResponse("NOT_AUTHROIZED", "error"));
            //return Promise.reject(error);
        }
    }
}