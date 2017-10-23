"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Errors {
    static VALID() {
        return { isValid: true, httpStatus: 200 };
    }
    static ACCOUNTID_INVALID() {
        return { isValid: false, message: "ACCOUNTID_INVALID", httpStatus: 400 };
    }
    static ACCOUNTS_MUST_BE_ARRAY() {
        return { isValid: false, message: "ACCOUNTS_MUST_BE_ARRAY", httpStatus: 400 };
    }
    static BODY_INVALID() {
        return { isValid: false, message: "BODY_INVALID", httpStatus: 400 };
    }
    ;
    static CIRCULAR_REFERENCE() {
        return { isValid: false, message: "CIRCULAR_REFERENCE", httpStatus: 400 };
    }
    static CREDENTIALS_INVALID() {
        return { isValid: false, message: "CREDENTIALS_INVALID", httpStatus: 422 };
    }
    static CREDENTIALS_MISSING() {
        return { isValid: false, message: "CREDENTIALS_MISSING", httpStatus: 400 };
    }
    static CREWSIZE_INVALID() {
        return { isValid: false, message: "CREWSIZE_INVALID", httpStatus: 400 };
    }
    static DUPLICATE_ACCOUNTS() {
        return { isValid: false, message: "DUPLICATE_ACCOUNTS", httpStatus: 400 };
    }
    static DUPLICATE_PROJECTS() {
        return { isValid: false, message: "DUPLICATE_ACCOUNTS", httpStatus: 400 };
    }
    static DUPLICATE_EMAIL() {
        return { isValid: false, message: "DUPLICATE_EMAIL", httpStatus: 409 };
    }
    static DURATIONHOURS_INVALID() {
        return { isValid: false, message: "DURATIONHOURS_INVALID", httpStatus: 400 };
    }
    static EMAIL_MISSING() {
        return { isValid: false, message: "EMAIL_MISSING", httpStatus: 400 };
    }
    static EMAIL_INVALID() {
        return { isValid: false, message: "EMAIL_INVALID", httpStatus: 400 };
    }
    static FAILED() {
        return { isValid: false, message: "FAILED", httpStatus: 400 };
    }
    static FAILED_TO_GRANT_USER_PERMISSION() {
        return { isValid: false, message: "FAILED_TO_GRANT_USER_PERMISSION", httpStatus: 400 };
    }
    static FIRSTNAME_MISSING() {
        return { isValid: false, message: "FIRSTNAME_MISSING", httpStatus: 400 };
    }
    static FORBIDDEN() {
        return { isValid: false, message: "FORBIDDEN", httpStatus: 403 };
    }
    static INVALID_ACCOUNTID() {
        return { isValid: false, message: "INVALID_ACCOUNTID", httpStatus: 400 };
    }
    static INVALID_PROJECTID() {
        return { isValid: false, message: "INVALID_PROJECTID", httpStatus: 400 };
    }
    static INVALID_PROJECT_OBJECT_ID() {
        return { isValid: false, message: "INVALID_PROJECT_OBJECT_ID", httpStatus: 400 };
    }
    static INVALID_PASSWORD() {
        return { isValid: false, message: "INVALID_PASSWORD", httpStatus: 400 };
    }
    static INVALID_ACCOUNT_PERMISSION() {
        return { isValid: false, message: "INVALID_ACCOUNT_PERMISSION", httpStatus: 400 };
    }
    static INVALID_PROJECT_PERMISSION() {
        return { isValid: false, message: "INVALID_PROJECT_PERMISSION", httpStatus: 400 };
    }
    static INVALID_USERID() {
        return { isValid: false, message: "INVALID_USERID", httpStatus: 400 };
    }
    static LASTNAME_MISSING() {
        return { isValid: false, message: "LASTNAME_MISSING", httpStatus: 400 };
    }
    static NAME_MISSING() {
        return { isValid: false, message: "NAME_MISSING", httpStatus: 400 };
    }
    static NO_PROJECT_PLANS() {
        return { isValid: false, message: "NO_PROJECT_PLANS", httpStatus: 400 };
    }
    static NO_PROJECT_STEPS() {
        return { isValid: false, message: "NO_PROJECT_STEPS", httpStatus: 400 };
    }
    static NOT_FOUND() {
        return { isValid: false, message: "NOT_FOUND", httpStatus: 404 };
    }
    static PASSWORD_MISSING() {
        return { isValid: false, message: "PASSWORD_MISSING", httpStatus: 400 };
    }
    static PREREQUISITEUIDS_INVALID() {
        return { isValid: false, message: "PREREQUISITEUIDS_INVALID", httpStatus: 400 };
    }
    static PROJECTS_MUST_BE_ARRAY() {
        return { isValid: false, message: "PROJECTS_MUST_BE_ARRAY", httpStatus: 400 };
    }
    static UID_INVALID() {
        return { isValid: false, message: "UID_MISSING", httpStatus: 400 };
    }
    static PROPERTIES_MISSING() {
        return { isValid: false, message: "PROPERTIES_MISSING", httpStatus: 400 };
    }
    static SERVER_ERROR() {
        return { isValid: false, message: "SERVER_ERROR", httpStatus: 500 };
    }
    static UIDS_INVALID() {
        return { isValid: false, message: "UIDS_INVALID", httpStatus: 400 };
    }
    static UNAUTHORIZED() {
        return { isValid: false, message: "UNAUTHORIZED", httpStatus: 401 };
    }
    static USER_DISABLED() {
        return { isValid: false, message: "USER_DISABLED", httpStatus: 422 };
    }
    static VERIFICATION_NUMBER_INVALID() {
        return { isValid: false, message: "VERIFICATION_NUMBER_INVALID", httpStatus: 400 };
    }
    static SUB_ID_MISSING() {
        return { isValid: false, message: "SUB_ID_MISSING", httpStatus: 400 };
    }
    static TRADE_CODE_MISSING() {
        return { isValid: false, message: "TRADE_CODE_MISSING", httpStatus: 400 };
    }
}
exports.Errors = Errors;
function serverError(err, req, res, next) {
    let serverError = Errors.SERVER_ERROR();
    let bodyInvalid = Errors.BODY_INVALID();
    serverError.exception = err;
    if (!utils_1.isEmpty(err.type) && err.type == "entity.parse.failed")
        return res.status(bodyInvalid.httpStatus).send(utils_1.wrapErrorResult(Errors.BODY_INVALID()));
    console.log(err);
    res.status(serverError.httpStatus).send(utils_1.wrapErrorResult(Errors.SERVER_ERROR()));
}
exports.serverError = serverError;
function notFound(req, res, next) {
    res.status(404).send(utils_1.wrapErrorResult(Errors.NOT_FOUND()));
}
exports.notFound = notFound;
;
