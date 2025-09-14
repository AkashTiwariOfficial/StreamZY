import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import playlistRouter from "./routes/playList.routes.js"
import commentRouter from "./routes/comment.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import likesRouter from "./routes/like.routes.js"
import serverResponse from "./routes/healthCheckup.routes.js"
import dashBoard from "./routes/dashboard.routes.js"
import searchMech from "./routes/searchEngine.routes.js"




const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriber", subscriptionRouter)
app.use("/api/v1/likes", likesRouter)
app.use("/api/v1/server", serverResponse)
app.use("/api/v1/dashboard", dashBoard)
app.use("/api/v1/streamZY", searchMech)





export { app } 