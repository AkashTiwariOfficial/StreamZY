import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js"

dotenv.config({
    path: './env'
});


connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`StreamZY is running on port: ${process.env.PORT}`);
    }) 
})
.catch((error) => {
    console.log("MongoDb connection failed !!", error);
})

