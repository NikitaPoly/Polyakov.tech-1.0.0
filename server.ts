import http = require("http");
import fs = require("fs");
const PORT:number = 8080;

type mimesList = {//type for the mim type list
    [key:string]:string
}
const MIMETYPES:mimesList = {//actula mime types list: contains all aprooved mime types;
    ".svg" : "image/svg+xml",
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "text/javascript",
    ".pdf" : "application/pdf",
    ".ico" : "image/x-icon"
}

const PolyakoDOTtech:http.Server = http.createServer();

const sendErrorPage= (res:http.ServerResponse)=>{//this is responsible for sending the 404 page not found// maybe change to change page based on type of err like 404 or 301
    console.log("page error")
    res.write("ErrorPage");
    res.end();
}

const GETRequestHandler = (requestUrl:string,res:http.ServerResponse)=>{//send the get requested apge
    if(!requestUrl.includes(".")){//if this is a base url like /home or / contact
        requestUrl = `/html${requestUrl}.html`
    }
    console.log("at " + requestUrl)
    fs.readFile(`./frontend${requestUrl}`,(err:NodeJS.ErrnoException|null,data:Buffer)=>{//now find the file to be sent fromt thr front end folder
        if(err){
            console.log(err);
            sendErrorPage(res);
            return
        }
        for(const [key,_] of Object.entries(MIMETYPES)){//look thu each mime type and select the opropriate once based on the . extension and set header
            if(requestUrl.includes(key)){
                console.log("With mime type : " + MIMETYPES[key]);
                res.setHeader("Content-Type",MIMETYPES[key]);
            }
        }
        res.write(data);
        res.end();
    })
}

const startRoutingRequest = (req:http.IncomingMessage,res:http.ServerResponse)=>{//first function hit. responsible for starting the right path of the request
    switch(req.method){//figure out what method was used
        case "GET":
            console.log("Get Request")
            //@ts-ignore: noImplicitAny
            GETRequestHandler(req.url,res);
        break
        default://if method is not supported
            sendErrorPage(res);
    }

}

PolyakoDOTtech.on("request",startRoutingRequest).listen(PORT);