import MongoDb = require('mongodb');

const mongoClient = MongoDb.MongoClient;
const mongoID = MongoDb.ObjectID;

var db;

export class DatabaseService {
    connect(connectionString: string): Promise<string> {
        return new Promise(function (resolve, reject) {
            mongoClient.connect(connectionString, (err, database) => {
                if (err) return reject(err);
                db = database;
                return resolve('Connected to MongoDB');
            });
        });
    }

    insertItem(object: string, item: any): Promise<any> {
        return new Promise(function(resolve, reject) {
            db.collection(object).insert(item, (err, result) => {
                if (err) return reject(err);
                if(result.ops[0]) return resolve(result.ops[0]);
                return resolve("");
            });
       });
    }

    lookupItem(object: string, query: any): Promise<any> {
        return new Promise(function(resolve, reject) {
            db.collection(object).findOne(query, (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            });
       });
    }

    getItemById(object: string, id: string): Promise<any> {
        return new Promise(function(resolve, reject) {
            let mongoId = new mongoID.createFromHexString(id);
            let query = {"_id": mongoId}
            db.collection(object).findOne(query, (err, result) => {
                if (err) return reject(err);
                return resolve(result); 
            });
       });
    }
}