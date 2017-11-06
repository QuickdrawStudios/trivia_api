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
const utils_1 = require("../utils/utils");
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
                    active: false,
                    stripeId: ''
                };
                let user = yield this.db.insertItem("users", newUser);
                if (!user)
                    return utils_1.buildResponse("REGISTRATION_FAILED", "error");
                let token = jwt.sign({ user }, 'my_secret_key', { 'expiresIn': '4hr' });
                return utils_1.buildResponse(token);
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
                if (!userId)
                    return utils_1.buildResponse('INVALID_USER', 'error');
                let user = yield this.db.getItemById("users", userId);
                if (!user)
                    return utils_1.buildResponse("INVALID_USER", "error");
                return utils_1.buildResponse(user);
            }
            catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        });
    }
    getAuthenticatedUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.db.getItemById("users", id);
                if (!user)
                    return utils_1.buildResponse("INVALID_USER", "error");
                return utils_1.buildResponse(user);
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
                    return utils_1.buildResponse("INVALID_USER", "error");
                if (user.password != json.password)
                    return utils_1.buildResponse("INCORRECT PASSWORD", "error");
                let token = jwt.sign({ user }, 'my_secret_key', { 'expiresIn': '4hr' });
                let authResponse = { "token": token, "active": user.active };
                return utils_1.buildResponse(authResponse);
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
                        return res.send(utils_1.buildResponse("NOT_AUTHORIZED", "error"));
                    res.locals.authenticatedUserId = decodedJwt.user._id;
                    return next();
                }
                else {
                    if ((req.path == '/login' || req.path == '/user') && req.method == 'POST')
                        return next();
                    return res.send(utils_1.buildResponse("NOT_AUTHROIZED", "error"));
                }
            }
            catch (error) {
                console.log(error);
                return res.send(utils_1.buildResponse("NOT_AUTHROIZED", "error"));
                //return Promise.reject(error);
            }
        });
    }
}
exports.UserService = UserService;
