const express = require('express');
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser')
const dbConnect = require("./utils/dbConnect");

const {auth} = require("./middlewares/auth.middleware");
const authRoute = require("./routes/auth.route");
const accountRoute = require("./routes/account.route");
const statsRoute = require("./routes/stats.route");

const PORT = process.env.PORT || 9090 ;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


app.get(["/", "/ping"], (req, res) => {
    const startTime = Date.now();
    return res.status(200).json({
        status: "ok",
        message: "pong",
        responseTime: `${Date.now() - startTime}ms`,
        serverTime: new Date().toISOString()
    });
})

app.use("/auth", authRoute);
app.use("/account", auth, accountRoute);
app.use("/stats", auth, statsRoute);

app.listen(PORT, ()=>{
    console.log(`[INFO] Server is running on port ${PORT}`)
    dbConnect();
})