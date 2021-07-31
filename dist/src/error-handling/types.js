"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPStatusCodes = void 0;
var HTTPStatusCodes;
(function (HTTPStatusCodes) {
    HTTPStatusCodes[HTTPStatusCodes["OK"] = 200] = "OK";
    HTTPStatusCodes[HTTPStatusCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTPStatusCodes[HTTPStatusCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HTTPStatusCodes[HTTPStatusCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTPStatusCodes[HTTPStatusCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    HTTPStatusCodes[HTTPStatusCodes["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    HTTPStatusCodes[HTTPStatusCodes["INTERNAL_SERVER"] = 500] = "INTERNAL_SERVER";
})(HTTPStatusCodes = exports.HTTPStatusCodes || (exports.HTTPStatusCodes = {}));
//# sourceMappingURL=types.js.map