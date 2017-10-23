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
const jwt = require("jsonwebtoken");
class UserService {
    constructor(db) {
        this.db = db;
    }
    create(json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newUser = {
                    email: json.email,
                    password: json.password,
                    active: false
                };
                let user = yield this.db.insertItem("users", newUser);
                if (!user)
                    return { "status": "error", "message": "REGISTRATION_FAILED" };
                let token = jwt.sign({ user }, 'my_secret_key', { 'expiresIn': '4hr' });
                return { "status": "ok", "message": token };
            }
            catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        });
    }
    read(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.db.getItemById("users", userId);
                if (!user)
                    return { "status": "error", "message": "INVALID_USER" };
                return { "status": "ok", "message": user };
            }
            catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        });
    }
    authenticate(json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.db.lookupItem('users', { "email": json.email });
                if (!user)
                    return { "status": "error", "message": "INVALID_USER" };
                if (user.password != json.password)
                    return { "status": "error", "message": "WRONG_PASSWORD" };
                let token = jwt.sign({ user }, 'my_secret_key', { 'expiresIn': '4hr' });
                let authResponse = { "token": token, "active": user.active };
                return { "status": "ok", "message": authResponse };
            }
            catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        });
    }
    isAuthenticated(req, res, next, db) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.authorization;
                if (token) {
                    let decodedJwt = jwt.verify(token, 'my_secret_key');
                    let user = yield this.db.getItemById("users", decodedJwt.user._id);
                    if (!user)
                        return res.send({ "status": "error", "message": "NOT AUTHORIZED" });
                    res.locals.authenticatedUserId = decodedJwt.user._id;
                    return next();
                }
                else {
                    if ((req.path == '/login' || req.path == '/user') && req.method == 'POST')
                        return next();
                    return res.send({ "status": "error", "message": "NOT AUTHORIZED" });
                }
            }
            catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        });
    }
}
exports.UserService = UserService;
