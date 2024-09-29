

const {body} = require("express-validator")
const validator = require("validator")
const { nationalIdValidation } = require("../utils/constants")

const createModeratorMiddleware = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().notEmpty().withMessage("Email is required").isEmail().withMessage('Please enter a valid email'),
    body('password').trim().notEmpty().withMessage("Password is required").custom(validator.isStrongPassword).withMessage("please enter a strong password"),
]
const updateModeratorMiddleware = [
    body('password').trim().notEmpty().withMessage("Password is required").custom(validator.isStrongPassword).withMessage("please enter a strong password"),
]

const loginModeratorMiddleware = [
    body('email').trim().notEmpty().withMessage("Email is required").isEmail().withMessage('Please enter a valid email'),
    body('password').trim().notEmpty().withMessage("Password is required").custom(validator.isStrongPassword).withMessage("please enter a strong password"),
]



module.exports = {
    createModeratorMiddleware,
    loginModeratorMiddleware,
    updateModeratorMiddleware,
}