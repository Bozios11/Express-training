import express from 'express';
import {query,validationResult,body,matchedData} from "express-validator";
import userRouters from "./routes/users.mjs";
import mockusers from "./utils/users.mjs";
import { loggingMiddleware } from './utils/middleware.mjs';
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./strategies/local-strategy.mjs"

const app = express();
app.use(cookieParser()); 
app.use(session({secret:'ansonaisthedibal123',resave:false,cookie: {
    maxAge: 60000 * 60,
},visited:true,saveUninitialized:true}));
app.use(express.json());  // Fix to correctly parse incoming JSON bodies
app.use(passport.initialize());
app.use(passport.session());
app.use(userRouters); // user routes 







const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});


app.get("/", loggingMiddleware, (request, response) => {
    
    //cookie making 
    console.log(request.session);
    console.log(request.sessionID);
    response.cookie('hello',"helloworld", {maxAge:60000*60})
    console.log(request.cookies.hello);
    response.status(200).send({ msg: "Hello" });
    
});


//session 2
app.post('/api/auth', (request,response) => {
    const {body: { username, password},} = request;

    const findUser = mockusers.find( (user) => user.username === username);
    if(!findUser || findUser.password !== password) return response.status(401).send({msg: "Bad creaditials"});
    request.session.user = findUser;
    return response.status(200).send(findUser);
})

app.get('/api/auth', (request,response) => {
    
    return request.session.user ? response.status(200).send(request.session.user) : response.status(401).send({msg: "Bad credentials"});
})

app.post('/api/cart', (request,response) => {
    if(!request.session.user) return response.status(401).send({msg: "Not authorized"});

    const {body: item} = request;

    const { cart } = request.session;
    if(cart){
        cart.push(item);
    }
    else{
        request.session.cart = [item];
    }
    console.log(request.session.cart);
    return response.sendStatus(201);
} );


//passport
app.post('/api/prob', passport.authenticate('local'), (request, response) => {
    
});

