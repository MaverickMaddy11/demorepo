const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "maddycool2004";

app.use(express.json())

const users = [];

const authorization = false; 

app.get("/",function(req,res){
    console.log("loading the file ");
    res.sendFile(__dirname + "/login.html");
})

app.post("/signup",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    

    users.push({
        username:username,
        password:password,
        content:[]
        
    })
    console.log(users);
    res.status(200).json({
        message:"you have been successfully signed up "
        
    })
})

app.post("/signin",function(req,res){
    const username = req.body.username; 
    const password = req.body.password;

    // verifying the user 
    let finduser = null; 
    for(let i = 0 ;i< users.length;i++){
        if(username == users[i].username && password == users[i].password){
            finduser = users[i];
        }
    }
    console.log(finduser);
    
    if(finduser != null){
        const token = jwt.sign({
            username
        },JWT_SECRET)

        res.status(200).json({
            token:token
        })

    }

    else{
        res.status(401).json({
            message:"you are not authorized for this "
        })
    }
    
})




function auth(req,res,next){
    console.log("hogyi teri balle balle ")
    const token = req.headers["token"];
    console.log(token);
    if(!token){
        return res.status(401).json({
            token : token ,
            message:"token not recieved mrala "
        });
    }

    try{
        const decdata = jwt.verify(token,JWT_SECRET);
        req.username = decdata;
        next();
    }
    catch(error){
        res.status(401).json({
            message:"kya be konw eh ne tu ?? "
        })
    }
}

app.use(auth)

app.get("/todo",function(req,res){

    res.sendFile(__dirname + "/contentpage.html");
})










app.post("/storedata",function(req,res){
    let founduser = null ;
    for(let i = 0 ; i< users. length; i ++ ){
        if(users[i].username === req.username ){
            founduser = users[i];
            break;
        }
    }
    if(founduser != null ){
        if(req.body.contentarr != null ){
            founduser.content = req.body.contentarr
        } 
        res.status(200).json({
            message:"balle balle "
        })
    }else{

    res.status(401).json({
        message:"something is wrong "
    })
    }      
})


app.get("/getdata",function(req,res){
    let founduser = null; 
    for(let i = 0 ; i< users.length; i++){
        if(users[i].username === req.username){
            founduser = users[i];
            break;
        }
    }
    if(founduser != null){
        res.status(200).json(founduser.content);
    }
    else{
        res.status(401).json({
            message:"unauthorised user "
        })
    }

})


app.listen(3000);



