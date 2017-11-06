"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const database_service_1 = require("./src/db/database.service");
const user_service_1 = require("./src/user/user.service");
const utils_1 = require("./src/utils/utils");
const app = express();
const routeFiles = [
    './src/user/routes.js',
    './src/payment/routes.js'
];
const databaseService = new database_service_1.DatabaseService;
const userService = new user_service_1.UserService(databaseService);
app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(utils_1.addCorsHeader);
app.use((req, res, next) => { return userService.isAuthenticated(req, res, next, databaseService); });
routeFiles.forEach(route => {
    app.use(require(route));
});
databaseService.connect("mongodb://app:oo8ua7tM@ds149998.mlab.com:49998/quickdraw").then(result => {
    console.log(result);
    startApp();
}).catch(err => {
    console.log(err);
});
function startApp() {
    app.listen(app.get('port'), function () {
        console.log('Listening on port ' + app.get('port'));
    });
}
