import { User } from './models/user.model';
import { DatabaseService } from '../db/database.service';
import jwt = require('jsonwebtoken');

export class UserService {
    private db: DatabaseService;

    constructor(db) {
        this.db = db;
    }

    async create(json: any): Promise<any> {
        try {
            let newUser: User = {
                email: json.email,
                password: json.password,
                active: false
            }
            let user = await this.db.insertItem("users", newUser);
            if(!user) return { "status": "error", "message": "REGISTRATION_FAILED"};
            let token = jwt.sign({ user }, 'my_secret_key', {'expiresIn': '4hr'});
            return { "status": "ok", "message": token };
        } catch (error){
            console.log(error);
            return Promise.reject(error);
        }
    }

    async read(userId: string): Promise<any> {
        try {
            let user: User = await this.db.getItemById("users", userId);
            if(!user) return { "status": "error", "message": "INVALID_USER"};
            return { "status": "ok",  "message": user };
        } catch (error){
            console.log(error);
            return Promise.reject(error);
        }
    }

    async authenticate(json: any): Promise<any>{
        try {
            let user: User = await this.db.lookupItem('users', {"email": json.email});
            if(!user) return { "status": "error", "message": "INVALID_USER" };
            if(user.password != json.password) return { "status": "error", "message": "WRONG_PASSWORD"}
            let token = jwt.sign({ user }, 'my_secret_key', {'expiresIn': '4hr'});
            let authResponse = { "token": token, "active": user.active };
            return { "status": "ok",  "message": authResponse };
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
                if (!user) return res.send({"status": "error", "message": "NOT AUTHORIZED"});
                res.locals.authenticatedUserId = decodedJwt.user._id;
                return next();
            } else {
                if((req.path == '/login' || req.path == '/user') && req.method == 'POST') return next();
                return res.send({"status": "error", "message": "NOT AUTHORIZED" });
            }
        }
        catch (error){
            console.log(error);
            return Promise.reject(error);
        }
    }
}