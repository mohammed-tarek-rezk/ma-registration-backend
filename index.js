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
    credentials: true,
    origin: function (origin, callback) {
      // Check if the incoming origin is in the allowedOrigins array
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Accept the request
      } else {
        callback(new Error('Not allowed by CORS')); // Reject the request
      }
    }
  };

app.use(cors(
      { 
    credentials: true,
    origin: process.env.FRONT_URL,
}))
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