import express = require('express');
import bodyParser = require('body-parser');

import { DatabaseService } from './src/db/database.service';
import { UserService } from './src/user/user.service';

const app = express();
const routeFiles: string[] = [ 
    './src/user/routes.js',
]

const databaseService = new DatabaseService;
const userService = new UserService(databaseService);

app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req, res, next) => { return userService.isAuthenticated(req, res, next, databaseService)});

routeFiles.forEach(route => {
    app.use(require(route));
});

databaseService.connect("mongodb://localhost:27017/trivia").then(result => {
    console.log(result);
    startApp();
  }).catch(err => {
    console.log(err);
  });
  
  function startApp(): void {
    app.listen(app.get('port'), function() {
        console.log('Listening on port ' + app.get('port'));
      });
  }