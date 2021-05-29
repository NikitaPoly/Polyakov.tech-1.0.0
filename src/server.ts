const http = require("http");
const url = require("url");
const fs = require("fs");
const PORT:number = 8080;
const polyakovDOTtech = http.createServer();

const cannotFindFilePage = (response:any)=>{
    response.end("Error Page");
}

const GETresourcesAndReturn =(urlOfRequest:any, response:any)=>{
    let pathOfResource:string = urlOfRequest.path;
    console.log(pathOfResource);
        if(!pathOfResource.includes(".")){//for index pages
        fs.readFile(`./frontend/html${pathOfResource}.html`,(err:any,data:any)=>{
            if(err){
                console.log("the error inside of reading  html file is: \n" + err);
                cannotFindFilePage(response);
                return;
            }
            response.write(data);
            response.end();
            return;
        })
        
    }
        fs.readFile(`./frontend/${pathOfResource}`,(err:any,data:any)=>{
            if(err){
                console.log("the error inside of reading file is: \n" + err);
                cannotFindFilePage(response);
                return;
            }
            //console.log(data);
            response.write(data);
            response.end();
        });  
}

const requestHandler = (request:any,response:any)=>{//first function hit. it is respisible for routing the request to the correct locations
    const requestURl = url.parse(request.url);
    const requestMethod = request.method;
    switch(requestMethod){
        case "GET":
            console.log("get request");
            GETresourcesAndReturn(requestURl, response);
        break;
        case "POST":
        break;
        default:
        console.log("unsupported requets method");
        response.end();
    }
}

polyakovDOTtech.on("request",requestHandler).listen(PORT);
