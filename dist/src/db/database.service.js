"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoDb = require("mongodb");
const mongoClient = MongoDb.MongoClient;
const mongoID = MongoDb.ObjectID;
var db;
class DatabaseService {
    connect(connectionString) {
        return new Promise(function (resolve, reject) {
            mongoClient.connect(connectionString, (err, database) => {
                if (err)
                    return reject(err);
                db = database;
                return resolve('Connected to MongoDB');
            });
        });
    }
    insertItem(object, item) {
        return new Promise(function (resolve, reject) {
            db.collection(object).insert(item, (err, result) => {
                if (err)
                    return reject(err);
                if (result.ops[0])
                    return resolve(result.ops[0]);
                return resolve("");
            });
        });
    }
    lookupItem(object, query) {
        return new Promise(function (resolve, reject) {
            db.collection(object).findOne(query, (err, result) => {
                if (err)
                    return reject(err);
                return resolve(result);
            });
        });
    }
    getItemById(object, id) {
        return new Promise(function (resolve, reject) {
            let mongoId = new mongoID.createFromHexString(id);
            let query = { "_id": mongoId };
            db.collection(object).findOne(query, (err, result) => {
                if (err)
                    return reject(err);
                return resolve(result);
            });
        });
    }
    updateItem(object, id, json) {
        return new Promise(function (resolve, reject) {
            let mongoId = new mongoID.createFromHexString(id);
            let query = { "_id": mongoId };
            let items = new Object;
            Object.keys(json).forEach(key => {
                if (key != "_id" && key != "id") {
                    items[key] = json[key];
                }
            });
            db.collection(object).update(query, { $set: items }, (err, result) => {
                if (err)
                    return reject(err);
                return resolve(result);
            });
        });
    }
}
exports.DatabaseService = DatabaseService;
