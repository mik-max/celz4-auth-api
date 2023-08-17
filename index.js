import mongoose from 'mongoose';
import express, { request } from 'express';
import Cors from 'cors';
import user from './models/users.js';
import 'dotenv/config'
import jwt from 'jsonwebtoken';


const app = express();

 //middlewares
 app.use(express.json());
 app.use(Cors({
     origin: '*'
 }));

 const port = process.env.PORT || 8000

   //DB config
mongoose.connect(process.env.DATABASE_CONNECTION_URL)

app.get('/', (req, res) => res.status(200).send('Christ embassy lagos zone 4!🔐'))

// user login
app.post('/api/v1/user/login', async (req, res) => {
     try {
         if(req.body.email !== ''){
               const member =  await user.findOne({email: req.body.email})
               if (member) {
                    let id = member._id.toString()
                    const token = jwt.sign({
                         id:  id
                    }, process.env.JWT_TOKEN_KEY)
                    let claims = {id: id, name: member.fullName, email: member.email}
                    res.status(200).send({status:'Ok', statusCode:200, data: {token, claims}, message: 'Login is successful'}) 
               }else{
                    res.status(404).send({status:'Failed', statusCode:404, data: null, message: 'User does not exists!'})
               }
         }else{
               res.status(400).send({status:'Failed', statusCode:400, data: null, message: 'kindly supply email address'})
         }
     } catch (error) {
          res.status(500).send({status: 'Failed', statusCode:500, data: null, message : error.message})
     }
    
 })

app.post('/api/v1/user/create', async(req, res) => {
     const body = req.body;
     try {
          if(body.email !==''  && body.fullName !== '' && body.church !== ''){
               let userExists = await user.findOne({email: req.body.email})
               console.log(userExists)
               if(userExists !== null) {
                    res.status(309).send({status:'Failed', statusCode:309, data: null, message:"User already exists"})
               }else{
                    await user.create(body)
                    res.status(201).send({status:'Ok', statusCode:201, data: null, message: 'user has been created successfully'})
               }
          }else{
               res.status(400).send({status:'Failed', statusCode:400, data: null, message: 'kindly fill all fields'})
          }
     } catch (error) {
          res.status(500).send({status: 'Failed', statusCode:500, data: null, message : error.message})
     }

})




 //listener
 app.listen(port, () => console.log(`Listening on localhost: ${port}`));