const Jwt  =require("jsonwebtoken");
const AppError = require("./AppError");
const statusText = require("./statusText");
const Member = require("../models/member.model");


const verifyMember = async (req , res , next)=>{
    let token = req.cookies.token
    if(!token) return next(AppError.create(statusText.ERROR , 401 , "Not authorized"))

    const decoded  = Jwt.verify(token , process.env.JWT_SECRET)
    if(!decoded) return next(AppError.create(statusText.ERROR , 401 , "Not authorized"))
    
    let checkMember = await Member.findById(decoded.id)
    if(!checkMember) return next(AppError.create(statusText.ERROR , 401 , "Not authorized"))
    
    req.member = checkMember
    next()
}

module.exports = verifyMember;