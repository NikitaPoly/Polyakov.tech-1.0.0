import http = require("http");
import fs = require("fs");
import { MongoClient } from "mongodb";
let PORT:any= process.env.PORT;
if(PORT == null || PORT == ""){
    PORT = 8080;
}

const offensiveNames:string[] = [
    "nig","fag","fuck","bitch","gay"
]

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

const saveToDB = (collectionName:string,dataTosave:string)=>{
    const uri = "mongodb+srv://PolyakovDOTTech:123abc@polyakovtechdb.n6fvv.mongodb.net/PolyakovTechDB?retryWrites=true&w=majority";
    MongoClient.connect(uri,(err,db)=>{//bunch of mongo code to connect to db and send the data
        if(err){
            console.log("Error when accesing db : " + err);
            return;
        }
        let dbo = db.db("PolyakovTechDB");
        dbo.collection(collectionName,(err,result)=>{
            result.insertOne({Content: dataTosave},(err)=>{
                if(err){
                    console.log(err);
                    return;
                }
                console.log("submited to db sucessfully");
            });
        })
    })
    
}

const POSTRequestHanlder = (wherePostCameFrom:string,req:http.IncomingMessage ,res:http.ServerResponse)=>{//take the incoming post request nd handler it
    console.log("Post at : " + wherePostCameFrom);
    req.on("data",(data:Buffer)=>{// handle the actual data then send thank you page
        switch(wherePostCameFrom){
            case "/contact":
                const message:string[]= data.toString("utf-8").split("&");
                for(let i = 0; i < message.length; i++){// replace all + with a space
                    message[i] = message[i].split("+").join(" ");
                }
                saveToDB("ContactRequest",message.toString());
                GETRequestHandler("/thankyou",res);
            break;
            case "/home":
                const message2:string[]  = data.toString("utf-8").split(",");
                for(let i = 0; i < offensiveNames.length; i++){//loop and check if any offensive word is in the name
                    if(message2[1].toLowerCase().includes(offensiveNames[i])){
                        console.log("Possible offensive word detected");
                        return;
                    }
                    console.log("will save to db")
                    saveToDB("ButtonGameLeaderBoard",message2.toString());
                    return;
                }
        }
    })
}

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
            if(req.url == "/"){//set the www.polyakov.tech to be www.polyakov.tech/home
                req.url += "home"
            }
            //@ts-ignore: noImplicitAny
            GETRequestHandler(req.url,res);
        break
        case "POST":
            console.log("Post Request");
            //@ts-ignore: noImplicitAny
            POSTRequestHanlder(req.url,req,res);
        break
        case "PATCH":
            console.log("someone wants to patch");
        default://if method is not supported
            sendErrorPage(res);
    }
}

PolyakoDOTtech.on("request",startRoutingRequest).listen(PORT);