const {validationResult} = require("express-validator")
const AppError = require("../utils/AppError")
const statusText = require("../utils/statusText")
const bcrypt = require("bcrypt")
const Member = require("../models/member.model")
const crypto = require("crypto")
const { sendVerifcationEmail, sendingWelcomeEmail, sendingResetPasswordEmail, sendingConfirmResetPassword } = require("../utils/email.config")
const { COMMUNITIES } = require("../utils/constants")
const Moderator = require("../models/moderator.model")
const generateTokenAndCookies = require("../utils/generateTokenAndCookies")
const validator = require("validator")
const signUp = async(req , res , next)=>{
    let error = validationResult(req)
    let {
        name, 
        email, 
        password, 
        phone, 
        idNumber, 
        faculty,
        university,
        department,
        academicYear,
        first, 
        facebook, 
        how, 
        firstCommunity, 
        secondCommunity,
        open_space
    } = req.body

    if(!error.isEmpty()){
        return next(AppError.create(statusText.FAIL , 400 , "invalid data",  error.array()))
    }
    let checkMember = await Member.find({$or: [{email} , {idNumber} , {phone}]})
    if(checkMember.length > 0){
        return next(AppError.create(statusText.FAIL , 400 , "member already exists", {}))
    }
    let hashPassword = await bcrypt.hash(password, 10)
    let verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    let verificationExp  = Date.now() + 1000 * 60 * 60 * 24;
    let newMember= new Member({
        name,
        email,
        password:  hashPassword,
        phone,
        idNumber,
        faculty,
        university,
        department,
        academicYear,
        first,
        facebook,
        how,
        firstCommunity,
        secondCommunity,
        verificationCode,
        verificationExp,
        open_space    })

    if(firstCommunity === COMMUNITIES.DATA || firstCommunity === COMMUNITIES.WEB || secondCommunity === COMMUNITIES.DATA || secondCommunity === COMMUNITIES.WEB){
        let itHR = await Moderator.findById("66f1a482c28230c23a99f1b6")
        if(itHR){
            newMember.moderator = itHR._id
            itHR.members.push(newMember._id)
            itHR.membersCount++;
            await itHR.save();
        }else{
            let HR = await Moderator.findOne({_id: {$ne: "66f1a482c28230c23a99f1b6" } , isAdmin: false}).sort({membersCount: 1})
            if(HR){
                newMember.moderator = HR._id
                HR.members.push(newMember._id)
                HR.membersCount++;
                await HR.save();
            }
        }
    }else{
        let HR = await Moderator.findOne({_id: {$ne: "66f1a482c28230c23a99f1b6"} , isAdmin: false}).sort({membersCount: 1})
            if(HR){
                newMember.moderator = HR._id
                HR.members.push(newMember._id)
                HR.membersCount++;
                await HR.save();
            }
    }
    await newMember.save()
    generateTokenAndCookies(res , {id: newMember._id}) 
    await sendVerifcationEmail(email , name ,verificationCode)
    res.json({status: statusText.SUCCESS , message: "member created successfully" , data: {...newMember._doc , password: undefined}})
}



const verifyEmail = async(req , res , next)=>{
    let error = validationResult(req)
    if(!error.isEmpty()){
        return next(AppError.create(statusText.FAIL , 400 , "invalid data",  error.array()))
    }
    let {code} = req.body
    let member = await Member.findOne({_id: req.member._id , verificationCode: code , verificationExp: {$gt: new Date()}})
    if(!member) return next(AppError.create(statusText.FAIL , 400 , "invalid verification code or Expired" , null))
    member.verificationCode = undefined
    member.verificationExp = undefined
    member.isVerified = true
    await member.save()
    await sendingWelcomeEmail(member.email , member.name)
    res.json({status: statusText.SUCCESS , message: "Email verified successfully" , data: member})
}
const login = async(req , res , next)=>{
    let error = validationResult(req)
    if(!error.isEmpty()){
        return next(AppError.create(statusText.FAIL , 400 , "invalid data",  error.array()))
    }
    let {email, password} = req.body
    let member = await Member.findOne({email}).select("+password")
    if(!member) return next(AppError.create(statusText.FAIL , 401 , "Invalid credentials" , null))
    let isMatch = await bcrypt.compare(password, member.password)
    if(!isMatch) return next(AppError.create(statusText.FAIL , 401 , "Invalid credentials" , null))
    generateTokenAndCookies(res , {id: member._id})
    res.json({status: statusText.SUCCESS , message: "Login successfully" , data: {...member._doc , password: undefined }})
}
const logout = async(req , res , next)=>{
    res.clearCookie("token")
    res.json({status: statusText.SUCCESS , message: "Logout successfully" ,data: null})
}
const forgetPassword = async(req , res , next)=>{
    let error = validationResult(req)
    if(!error.isEmpty()){
        return next(AppError.create(statusText.FAIL , 400 , "invalid data",  error.array()))
    }
    let {email} = req.body
    let member = await Member.findOne({email})
    if(!member) return next(AppError.create(statusText.FAIL , 400 , "No member found with this email" , null))
    let resetToken = crypto.randomBytes(30).toString("hex")
    let resetTokenExpiresAt = Date.now() + 1000 * 60 * 60
    member.resetPasswordToken = resetToken
    member.resetPasswordExp = resetTokenExpiresAt
    await member.save()
    await sendingResetPasswordEmail(member.email , member.name, resetToken)
    res.json({status: statusText.SUCCESS , message: "Reset password link sent successfully" , data: null})
}
const resitPassword = async(req , res , next)=>{
    const {token} = req.params
    const {password} = req.body
    if(!password || !validator.isStrongPassword(password)) return next(AppError.create(statusText.FAIL , 400 , "Please enter valid strong password"))
    const member = await Member.findOne({resetPasswordToken: token , resetPasswordExp: {$gt: Date.now()}}).select("+password")
    if(!member) return next(AppError.create(statusText.FAIL , 404 , "InValid Reset token or Reset Token Expired"))
    if(await bcrypt.compare(password , member.password)) return next(AppError.create(statusText.FAIL , 400 , "password should not match the previous one"))
    let hashPassword = await bcrypt.hash(password , 10)
    member.password = hashPassword;
    member.resetPasswordToken = undefined;
    member.resetPasswordExp = undefined;
    await member.save();
    await sendingConfirmResetPassword(member.email , member.name)
    res.json({status: statusText.SUCCESS , message: "Password Reset Successfully"})

}



module.exports ={
    signUp,
    verifyEmail,
    login,
    logout,
    forgetPassword,
    resitPassword
}