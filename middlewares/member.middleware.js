const {body} = require("express-validator")
const validator = require("validator")
const { nationalIdValidation } = require("../utils/constants")

const signUpMiddleware = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().notEmpty().withMessage("Email is required").isEmail().withMessage('Please enter a valid email'),
    body('password').trim().notEmpty().withMessage("Password is required").custom(validator.isStrongPassword).withMessage("please enter a strong password"),
    body('phone').trim().notEmpty().withMessage("phone is required").custom((value)=> /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/.test(value)).withMessage("please enter a valid Egyption phone number"),
    body('idNumber').trim().notEmpty().withMessage("ID Number is required").custom((value)=> nationalIdValidation(value)).withMessage("Please enter a valid ID number"),
    body('faculty').trim().notEmpty().withMessage("Faculty is required"),
    body('university').trim().notEmpty().withMessage("University is required"),
    body('department').trim().notEmpty().withMessage("Department is required"),
    body('academicYear').trim().notEmpty().withMessage("Academic Year is required"),
    body('facebook').trim().notEmpty().withMessage("Facebook URL is required").isURL().withMessage("Please enter a valid Facebook URL"),
    body('how').trim().notEmpty().withMessage("how do you know us is required"),
    body('firstCommunity').trim().notEmpty().withMessage("First Community required"),
    body('secondCommunity').trim().notEmpty().withMessage("Second Community is required").custom((value , {req})=> value !== req.body.firstCommunity).withMessage("The Two Communities should be difference"),
    body("first").trim().notEmpty().withMessage("first time to enter chapter is required ").toBoolean()
]
const updateMemberMiddleware = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage("phone is required").custom((value)=> /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/.test(value)).withMessage("please enter a valid Egyption phone number"),
    body('idNumber').trim().notEmpty().withMessage("ID Number is required").custom((value)=> nationalIdValidation(value)).withMessage("Please enter a valid ID number"),
    body('faculty').trim().notEmpty().withMessage("Faculty is required"),
    body('university').trim().notEmpty().withMessage("University is required"),
    body('department').trim().notEmpty().withMessage("Department is required"),
    body('academicYear').trim().notEmpty().withMessage("Academic Year is required"),
    body('facebook').trim().notEmpty().withMessage("Facebook URL is required").isURL().withMessage("Please enter a valid Facebook URL"),
]


const verifyEmailMiddleware= [
    body('code').trim().notEmpty().withMessage('Code is required'),
]

const memberLoginMiddleware= [
    body('email').trim().notEmpty().withMessage("Email is required").isEmail().withMessage('Please enter a valid email'),
    body('password').trim().notEmpty().withMessage("Password is required").custom(validator.isStrongPassword).withMessage("please enter a valid Strong password"),
]
const forgetPasswordMiddleware= [
    body('email').trim().notEmpty().withMessage("Email is required").isEmail().withMessage('Please enter a valid email'),
]



module.exports = {
    signUpMiddleware,
    verifyEmailMiddleware,
    memberLoginMiddleware,
    forgetPasswordMiddleware,
    updateMemberMiddleware
}