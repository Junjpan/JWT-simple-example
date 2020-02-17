const express=require('express');
const jwt=require('jsonwebtoken');

const app=express();

app.get('/api',(req,res)=>{
    res.json({
        message:"Welcome to the API"
    })
})

app.post('/api/posts',verifyToken,(req,res)=>{
    jwt.verify(req.token,"secrectmiao",(err,authData)=>{
       if(err){
           res.sendStatus(403)
       }else{
        res.json({
            message:"Post created...",
            authData
        })
       }
    })
    
})

app.post('/api/login',(req,res)=>{
    //Mock user
    const user={
        id:1,
        username:"Jun",
        email:"jun@yahoo.com"
    };

    //create a token, you can make any secret key if you want, we also add an option for the expiration
    jwt.sign({user},"secrectmiao",{expiresIn:'2h'},(err,token)=>{
        res.json({token}) //send the token to the frontend and save in the localstorage,and then make the request to the protected
                          //routes, in our case for the posts routes
    })
})

// we set the format of token
//authorization: Bearer <access_token>

//verify token
function verifyToken(req,res,next){
    //get auth header value
    //console.log(req.headers)
    const bearerHeader=req.headers['Authentication'];
    //check if bearer is undefined
    if (typeof bearerHeader !=='undefined'){
        //split at the space and get the token
        const bearerToken=bearerHeader.split(' ')[1]
        //set the token
     req.token=bearerToken;
     //next middleware
     next();
    }else{
        //forbidden
        res.sendStatus(403)
    }
}

app.listen(5000,()=>{
    console.log('server started on port 5000')
})