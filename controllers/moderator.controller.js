const {validationResult} = require("express-validator")
const AppError = require("../utils/AppError")
const statusText = require("../utils/statusText")
const Moderator = require("../models/moderator.model")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const generateTokenAndCookies = require("../utils/generateTokenAndCookies")
const generateModeratorTokenAndCookies = require("../utils/generateModeratorTokenAndCookies")

const createModerator = async(req , res ,next)=>{
    let checkAdmin = req.moderator.isAdmin 
    if(!checkAdmin)return next(AppError.create(statusText.ERROR , 401 , "Not authorized"))
    const errors =  validationResult(req)
    if(!errors.isEmpty()){
        return next(AppError.create(statusText.FAIL , 400 , "invalid data"  , errors.array()))
    }
    let {email, name , password} = req.body
    let checkModerator = await Moderator.findOne({email})
    if(checkModerator) return next(AppError.create(statusText.FAIL , 400 , "moderator already exists" , null))
    let hashPassword = await bcrypt.hash(password , 10)
    let newModerator = new Moderator({email, name, password: hashPassword})
    await newModerator.save()
    res.json({status: statusText.SUCCESS , message: "Moderator created Successfully" , data: {...newModerator._doc , password: undefined}})
}


const getModerators = async(req , res ,next)=>{
    let checkAdmin = req.moderator.isAdmin 
    if(!checkAdmin)return next(AppError.create(statusText.ERROR , 401 , "Not authorized"))
    let moderators = await Moderator.find({_id: {$ne: req.moderator._id} , isAdmin: false})
    res.json({status: statusText.SUCCESS , message: "Moderators fetched Successfully" , data: moderators})
 
}


const getSingleModerator = async(req , res ,next)=>{
    let moderatorId = req.params.moderatorId
    if(!mongoose.Types.ObjectId.isValid(moderatorId)) return next(AppError.create(statusText.FAIL , 400 , "invalid data"))
    let moderator = await Moderator.findById(moderatorId).populate("members")
    if(!moderator) return next(AppError.create(statusText.FAIL , 404 , "Moderator not found" , null))
    res.json({status: statusText.SUCCESS , message: "Moderator fetched Successfully" , data: moderator})
}


const updateModerator = async(req , res ,next)=>{
    let { password } = req.body
    let moderatorId = req.moderator._id
    const errors =  validationResult(req)
    if(!errors.isEmpty()){
        return next(AppError.create(statusText.FAIL , 400 , "invalid data"  , errors.array()))
    }
    if(!mongoose.Types.ObjectId.isValid(moderatorId)) return next(AppError.create(statusText.FAIL , 400 , "invalid data"))
    let moderator = await Moderator.findById(moderatorId).select("+password")
    if(!moderator) return next(AppError.create(statusText.FAIL , 404 , "Moderator not found" , null))
    let isMatch = await bcrypt.compare(password, moderator.password)
    if(isMatch) return next(AppError.create(statusText.FAIL , 400 , "New Password should not match old password" , null))
    let hashPassword = await bcrypt.hash(password , 10)
    moderator.password = hashPassword
    await moderator.save()
    res.clearCookie("moderatorToken")
    res.json({status: statusText.SUCCESS , message: "Moderator updated Successfully" , data: {...moderator._doc, password: undefined}})
}
const changeActiveState = async(req , res ,next)=>{
    let moderatorId = req.params.moderatorId
    let checkAdmin = req.moderator.isAdmin 
    if(!checkAdmin)return next(AppError.create(statusText.ERROR , 401 , "Not authorized"))
    if(!mongoose.Types.ObjectId.isValid(moderatorId)) return next(AppError.create(statusText.FAIL , 400 , "invalid data"))
    let moderator = await Moderator.findById(moderatorId)
    if(!moderator) return next(AppError.create(statusText.FAIL , 404 , "Moderator not found" , null))
    moderator.isActive =!moderator.isActive
    await moderator.save()
    res.json({status: statusText.SUCCESS , message: "Moderator status updated Successfully" , data: moderator})
}

const deleteModerator = async(req , res ,next)=>{
    let moderatorId = req.params.moderatorId
    let checkAdmin = req.moderator.isAdmin 
    if(!checkAdmin)return next(AppError.create(statusText.ERROR , 401 , "Not authorized"))
    if(!mongoose.Types.ObjectId.isValid(moderatorId)) return next(AppError.create(statusText.FAIL , 400 , "invalid data"))
    await Moderator.findByIdAndDelete(moderatorId)
    res.json({status: statusText.SUCCESS , message: "Moderators deleted Successfully" , data: null})
}

const loginModerator = async(req , res ,next)=>{
    const errors =  validationResult(req)
    if(!errors.isEmpty()){
        return next(AppError.create(statusText.FAIL , 400 , "invalid data"  , errors.array()))
    }
    let {email, password} = req.body
    let moderator = await Moderator.findOne({email , isActive: true}).select("+password").select("-members")
    if(!moderator) return next(AppError.create(statusText.FAIL , 401 , "Invalid credentials" , null))
    let isMatch = await bcrypt.compare(password, moderator.password)
    if(!isMatch) return next(AppError.create(statusText.FAIL , 401 , "Invalid credentials" , null))
    generateModeratorTokenAndCookies(res , {id: moderator._id})
    res.json({status: statusText.SUCCESS , message: "Logged in Successfully" , data: {...moderator._doc, password: undefined}})
}

const logoutModerator = async(req , res ,next)=>{
    res.clearCookie("moderatorToken")
    res.json({status: statusText.SUCCESS , message: "Logout successfully"})
}
module.exports = {
    createModerator,
    getModerators,
    getSingleModerator,
    updateModerator,
    deleteModerator,
    loginModerator,
    logoutModerator,
    changeActiveState
}