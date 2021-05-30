"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const fs = require("fs");
const mongodb_1 = require("mongodb");
let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
    PORT = 8080;
}
const offensiveNames = [
    "nig", "fag", "fuck", "bitch", "gay"
];
const MIMETYPES = {
    ".svg": "image/svg+xml",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".pdf": "application/pdf",
    ".ico": "image/x-icon"
};
const PolyakoDOTtech = http.createServer();
const saveToDB = (collectionName, dataTosave) => {
    const uri = "mongodb+srv://PolyakovDOTTech:123abc@polyakovtechdb.n6fvv.mongodb.net/PolyakovTechDB?retryWrites=true&w=majority";
    mongodb_1.MongoClient.connect(uri, (err, db) => {
        if (err) {
            console.log("Error when accesing db : " + err);
            return;
        }
        let dbo = db.db("PolyakovTechDB");
        dbo.collection(collectionName, (err, result) => {
            result.insertOne({ Content: dataTosave }, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("submited to db sucessfully");
            });
        });
    });
};
const POSTRequestHanlder = (wherePostCameFrom, req, res) => {
    console.log("Post at : " + wherePostCameFrom);
    req.on("data", (data) => {
        switch (wherePostCameFrom) {
            case "/contact":
                const message = data.toString("utf-8").split("&");
                for (let i = 0; i < message.length; i++) { // replace all + with a space
                    message[i] = message[i].split("+").join(" ");
                }
                saveToDB("ContactRequest", message.toString());
                GETRequestHandler("/thankyou", res);
                break;
            case "/home":
                const message2 = data.toString("utf-8").split(",");
                for (let i = 0; i < offensiveNames.length; i++) { //loop and check if any offensive word is in the name
                    if (message2[1].toLowerCase().includes(offensiveNames[i])) {
                        console.log("Possible offensive word detected");
                        return;
                    }
                    console.log("will save to db");
                    saveToDB("ButtonGameLeaderBoard", message2.toString());
                    return;
                }
        }
    });
};
const sendErrorPage = (res) => {
    GETRequestHandler("/error", res);
};
const GETRequestHandler = (requestUrl, res) => {
    if (!requestUrl.includes(".")) { //if this is a base url like /home or / contact
        requestUrl = `/html${requestUrl}.html`;
    }
    console.log("at " + requestUrl);
    fs.readFile(`./frontend${requestUrl}`, (err, data) => {
        if (err) {
            console.log(err);
            sendErrorPage(res);
            return;
        }
        for (const [key, _] of Object.entries(MIMETYPES)) { //look thu each mime type and select the opropriate once based on the . extension and set header
            if (requestUrl.includes(key)) {
                console.log("With mime type : " + MIMETYPES[key]);
                res.setHeader("Content-Type", MIMETYPES[key]);
            }
        }
        res.write(data);
        res.end();
    });
};
const startRoutingRequest = (req, res) => {
    switch (req.method) { //figure out what method was used
        case "GET":
            console.log("Get Request");
            if (req.url == "/") { //set the www.polyakov.tech to be www.polyakov.tech/home
                req.url += "home";
            }
            //@ts-ignore: noImplicitAny
            GETRequestHandler(req.url, res);
            break;
        case "POST":
            console.log("Post Request");
            //@ts-ignore: noImplicitAny
            POSTRequestHanlder(req.url, req, res);
            break;
        case "PATCH":
            console.log("someone wants to patch");
        default: //if method is not supported
            sendErrorPage(res);
    }
};
PolyakoDOTtech.on("request", startRoutingRequest).listen(PORT);
