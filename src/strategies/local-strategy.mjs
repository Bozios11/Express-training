import passport from 'passport';
import {Strategy} from 'passport-local';
import  mockusers  from "../utils/users.mjs";

export default passport.use(
    
   new Strategy((username,password,done) => {
       console.log(username);
       console.log(password);
    try{
       const findUser = mockusers.find((user) => user.username === username);
       if(!findUser) throw new Error(`User not found`);
       if(findUser.password !== password) throw new Error('Invalid credentials');
       done(null,findUser);
       }

    catch(err) 
       { 
         done(err, null);
       }
   }));

   