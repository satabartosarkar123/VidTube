import express from 'express';
import cors from "cors"; // it is basically a middleware
import cookieParser from 'cookie-parser';
import multer from 'multer'; // for handling multipart/form-data
const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
)); // this will allow all the requests from all the origins

//common middleware
app.use(express.json({limit: "16kb"})); // this will parse the incoming requests with JSON payloads
app.use(express.urlencoded({extended: true, limit: "16kb"})); // this will parse the incoming requests with urlencoded payloads
app.use(express.static("public"))
app.use(cookieParser()); // this will parse the cookies attached to the client request object
// multer is for file handling

//bring routes
import healthCheckRoutes from './routes/healthCheck.routes.js';

//routes
app.use('/api/v1/healthcheck', healthCheckRoutes);

export {app};