const AppError = require("../utils/AppError");
const Member = require("../models/member.model");
const statusText = require("../utils/statusText");
const mongoose = require("mongoose");
const {validationResult} = require("express-validator");
const Moderator = require("../models/moderator.model");
const { HOW_KNOW } = require("../utils/constants");
const validator = require("validator")
const getMembers= async(req , res, next)=>{
    let members = await Member.find().populate("moderator", "name").sort({createdAt: -1})
    res.json({status: statusText.SUCCESS , message: "get users successfully" , data: members } )
}
const getSingleMember= async(req , res, next)=>{
    let memberId = req.params.memberId
    if(!mongoose.Types.ObjectId.isValid(memberId)) return next(AppError.create(statusText.FAIL , 400 , "invalid data"))
    let member = await Member.findById(memberId).populate("moderator", "name")
    if(!member) return next(AppError.create(statusText.FAIL , 404 , "member not found", null))
    res.json({status: statusText.SUCCESS , message: "get user successfully" , data: member})
}
const updateMember= async(req , res, next)=>{
    let error = validationResult(req)
    if(!error.isEmpty()){
        return next(AppError.create(statusText.FAIL , 400 , "invalid data",  error.array()))
    }
    let memberId = req.member._id
    if(!mongoose.Types.ObjectId.isValid(memberId)) return next(AppError.create(statusText.FAIL , 400 , "invalid data"))
    let { name, phone, faculty, university, department, academicYear, facebook , idNumber} = req.body 
    let member = await Member.findByIdAndUpdate(memberId,  { name, phone, faculty, university, department, academicYear, facebook , idNumber}, {new: true})
    if(!member) return next(AppError.create(statusText.FAIL , 404 , "member not found", null))

    res.json({status: statusText.SUCCESS , message: "update user successfully" , data: member})
}
const deleteMember= async(req , res, next)=>{
    let memberId = req.member._id
    if(!mongoose.Types.ObjectId.isValid(memberId)) return next(AppError.create(statusText.FAIL , 400 , "invalid data"))
    let member = await Member.findById(memberId)
    let memberModerator = await Moderator.findById(member.moderator)
    if(!memberModerator) return next(AppError.create(statusText.FAIL , 404 , "Moderator Not Found"))
    if(!member) return next(AppError.create(statusText.FAIL , 404 , "member not found", null))
    memberModerator.membersCount--;
    let newMembers = memberModerator.members.filter((el)=> el.toString() !== member._id.toString())
    memberModerator.members = newMembers;
    await memberModerator.save();
    await Member.findByIdAndDelete(memberId)
    res.json({status: statusText.SUCCESS , message: "delete user successfully" , data: null})
}


const changeStatus= async(req , res, next)=>{
    let moderator = req.moderator

    let memberId = req.params.memberId

    let statusId = +req.params.statusId

    if(!mongoose.Types.ObjectId.isValid(memberId)) return next(AppError.create(statusText.FAIL , 400 , "invalid data"))

    let member = await Member.findById(memberId)
    if(!member) return next(AppError.create(statusText.FAIL , 404 , "member not found", null))
    if(member.moderator.toString() !== moderator._id.toString() && moderator.isAdmin === false) return next(AppError.create(statusText.FAIL, 401 , "not  allowed for you to change status" , null))

    let newMemberStatus = member.status.map((el)=>{
        if(el.id === statusId){
            el.done = !el.done
            el.date = new Date()
        }
        return el
    })

    member.status = newMemberStatus;

    let newMember =await Member.findByIdAndUpdate(memberId, { status: newMemberStatus})

    res.json({status: statusText.SUCCESS , message: "status changed successfully" , data: null})
}


const acceptIn = async(req , res , next)=>{
    let memberId = req.params.memberId;
    let {acceptedIn} = req.body
    if(!Array.isArray(acceptedIn)) return next(AppError.create(statusText.FAIL , 400 , "invalid data"))
    if(!mongoose.Types.ObjectId.isValid(memberId)) return next(AppError.create(statusText.FAIL , 400 , "invalid data"))
    let member = await Member.findById(memberId)
    if(!member) return next(AppError.create(statusText.FAIL , 404 , "member not found", null))
    member.acceptedIn = acceptedIn
    await member.save()
    res.json({status: statusText.SUCCESS , message: "acceptedIn changed successfully" , data: null})
}   
module.exports={
    getMembers,
    getSingleMember,
    updateMember,
    deleteMember,
    changeStatus,
    acceptIn
}