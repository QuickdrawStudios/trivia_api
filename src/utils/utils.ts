import { ResponseResult } from './models/responseResult';

export function buildResponse(message: any, status: string = 'ok'): ResponseResult {
    let response: ResponseResult = {
        'status': status,
        'message': message
    };
    return response;
}

export function addCorsHeader(req, res, next) {
    let serverUrl: string = process.env.SERVER_URL || "*";
    var origin = req.headers.origin;
    if (!isEmpty(origin) && origin.indexOf("localhost") > - 1) serverUrl = '*';
    if (isEmpty(origin)) return next();
    if(serverUrl == '*' || origin.indexOf(serverUrl) > -1){
        addHeaders(res, req, next, origin);
    }
    send200IfOptionsRequest(req, res, next);
}

function addHeaders(res, req, next, origin: string) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin, Accept, \
        X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
}

function send200IfOptionsRequest(req, res, next) {
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next()
    }
}

export function isEmpty(item: any): boolean {
    if (item == undefined) return true;
    if (item == null) return true;
    if (item == '') return true;
    if (typeof item == 'object') {
        if (Object.keys(item).length == 0) return true;
    }
    return false;
}