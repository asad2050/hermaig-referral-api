import express from 'express'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import protectRoutes from './middlewares/protectRoutes.mjs';
import isAuth from './middlewares/isAuth.mjs'
import authRoutes from './routes/auth.routes.mjs'
import userRoutes from './routes/user.routes.mjs'
import referralRoutes from './routes/referral.routes.mjs';
import adminRoutes from './routes/admin.routes.mjs'
// import path from 'path';
// import { fileURLToPath } from 'url';
import passport from 'passport';
// import './util/passport.mjs'; // Ensure this is loaded
import helmet from 'helmet';
// import redisClient from './redisClient.js';


const app = express();

// app.use(cors());
app.use(cors({
  origin: process.env.FRONTEND_URL
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(helmet());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/auth",authRoutes);
app.use("/api/user",isAuth,userRoutes);
app.use('/api/referral',isAuth,protectRoutes,referralRoutes)
app.use('/api/admin',isAuth, protectRoutes,adminRoutes)

app.use((error, req, res, next) => {
    console.log(error);
      // if (error.code === 11000) {
      //   // Handle duplicate key error
      //   error.message="This email or phoneNumber already exists."
      //   error.status=409;
      // }
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });
  
  let mongodbUrl ='mongodb://127.0.0.1:27017/hermaig-referral-api'

  if (process.env.MONGODB_URL) {
    mongodbUrl = process.env.MONGODB_URL; 
  }
  let PORT = 3000;
  if(process.env.PORT){
    PORT = process.env.PORT;
  }
  mongoose.connect(mongodbUrl).then(function(){
      app.listen(PORT);
  }).catch(err => {
      console.log(err);
    });