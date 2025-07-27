import dotenv from 'dotenv';
import connectDB from './db/index.js';


dotenv.config({ // this loads the variables from the .env text file to the process.env  object
    path:"./src/.env",
});

import {app} from './app.js';
const port=process.env.port||7000;




connectDB().then(
    ()=>{
        app.listen(port,()=>{
            console.log(`running on port no. ${port}`)
        })
    }
).catch((err)=>{
    console.log("Error connecting to the database", err);
})


app.get("/",(req,res)=>{
    res.send("here is home directory")
    res.status=201;
    res.end();
})
