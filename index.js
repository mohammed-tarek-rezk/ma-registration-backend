const express = require('express')
require("dotenv").config()
require("express-async-errors")
require("./db")
const cors = require("cors")
const memberRoute = require('./routes/member.route')
const cookieParser = require("cookie-parser")
const memberAuthRoute = require('./routes/member.auth.route')
const AppError = require('./utils/AppError')
const statusText = require('./utils/statusText')
const morgan = require("morgan")
const moderatorRoute = require('./routes/moderator.route')


const app = express()
const port = process.env.PORT || 5000

app.use(morgan("short"))

const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true,
};


app.use(cors(corsOptions));

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))




app.use("/api/v1/members", memberRoute)
app.use("/api/v1/members/auth", memberAuthRoute)
app.use("/api/v1/moderators/", moderatorRoute)


app.all("*", (req , res , next)=>{
    next(AppError.create(statusText.FAIL , 404 , "Route Not Found" , null))
})


app.use((error , req , res , next)=>{
    res.status(error.statusCode || 500).json({
        status: error.status || statusText.ERROR,
        message: error.message || "Something went wrong", 
        data: error.data || null
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))