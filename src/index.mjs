import express from 'express';
import {query,validationResult,body,matchedData} from "express-validator";
import userRouters from "./routes/users.mjs";
import mockusers from "./utils/users.mjs";
import { loggingMiddleware } from './utils/middleware.mjs';
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();
app.use(cookieParser()); 
app.use(session({secret:'ansonaisthedibal123',resave:false,cookie: {
    maxAge: 60000 * 60,
},visited:true,saveUninitialized:true}));
app.use(express.json());  // Fix to correctly parse incoming JSON bodies
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

app.post('/api/auth', (request,response) => {
    const {body: { username, password},} = request;
    
    const findUser = mockusers.find( (user) => user.name === username);
    
    if(!findUser || findUser.password !== password) return response.status(401).send({msg: "Bad creaditials"});
    
    request.session.user = findUser;
    return response.status(200).send(findUser);
})

app.get('/api/auth', (request,response) => {
    
    return request.session.user ? response.send(200).send(request.session.user) : response.send(401).send({msg: "Bad credentials"});
})




