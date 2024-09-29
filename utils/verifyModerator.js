const Jwt  =require("jsonwebtoken");
const AppError = require("./AppError");
const statusText = require("./statusText");
const Moderator = require("../models/moderator.model");


const verifyModerator = async (req , res , next)=>{
    let moderatorToken = req.cookies.moderatorToken
    if(!moderatorToken) return next(AppError.create(statusText.ERROR , 401 , "Not authorized"))

    const decoded  = Jwt.verify(moderatorToken , process.env.JWT_SECRET)
    if(!decoded) return next(AppError.create(statusText.ERROR , 401 , "Not authorized"))
    
    let checkModerator = await Moderator.findById(decoded.id)
    if(!checkModerator) return next(AppError.create(statusText.ERROR , 401 , "Not authorized"))
    
    req.moderator = checkModerator
    next()
}

module.exports = verifyModerator;