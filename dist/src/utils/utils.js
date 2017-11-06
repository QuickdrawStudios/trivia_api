"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildResponse(message, status = 'ok') {
    let response = {
        'status': status,
        'message': message
    };
    return response;
}
exports.buildResponse = buildResponse;
function addCorsHeader(req, res, next) {
    let serverUrl = process.env.SERVER_URL || "*";
    var origin = req.headers.origin;
    if (!isEmpty(origin) && origin.indexOf("localhost") > -1)
        serverUrl = '*';
    if (isEmpty(origin))
        return next();
    if (serverUrl == '*' || origin.indexOf(serverUrl) > -1) {
        addHeaders(res, req, next, origin);
    }
    send200IfOptionsRequest(req, res, next);
}
exports.addCorsHeader = addCorsHeader;
function addHeaders(res, req, next, origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin, Accept, \
        X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
}
function send200IfOptionsRequest(req, res, next) {
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
}
function isEmpty(item) {
    if (item == undefined)
        return true;
    if (item == null)
        return true;
    if (item == '')
        return true;
    if (typeof item == 'object') {
        if (Object.keys(item).length == 0)
            return true;
    }
    return false;
}
exports.isEmpty = isEmpty;
