"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var fs = require("fs");
var PORT = 8080;
var MIMETYPES = {
    ".svg": "image/svg+xml",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".pdf": "application/pdf",
    ".ico": "image/x-icon"
};
var PolyakoDOTtech = http.createServer();
var sendErrorPage = function (res) {
    console.log("page error");
    res.write("ErrorPage");
    res.end();
};
var GETRequestHandler = function (requestUrl, res) {
    if (!requestUrl.includes(".")) { //if this is a base url like /home or / contact
        requestUrl = "/html" + requestUrl + ".html";
    }
    console.log("at " + requestUrl);
    fs.readFile("./frontend" + requestUrl, function (err, data) {
        if (err) {
            console.log(err);
            sendErrorPage(res);
            return;
        }
        for (var _i = 0, _a = Object.entries(MIMETYPES); _i < _a.length; _i++) { //look thu each mime type and select the opropriate once based on the . extension and set header
            var _b = _a[_i], key = _b[0], _ = _b[1];
            if (requestUrl.includes(key)) {
                console.log("With mime type : " + MIMETYPES[key]);
                res.setHeader("Content-Type", MIMETYPES[key]);
            }
        }
        res.write(data);
        res.end();
    });
};
var startRoutingRequest = function (req, res) {
    switch (req.method) { //figure out what method was used
        case "GET":
            console.log("Get Request");
            //@ts-ignore: noImplicitAny
            GETRequestHandler(req.url, res);
            break;
        default: //if method is not supported
            sendErrorPage(res);
    }
};
PolyakoDOTtech.on("request", startRoutingRequest).listen(PORT);
