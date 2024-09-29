const express = require('express');
const { signUp, verifyEmail, login, logout, forgetPassword, resitPassword } = require('../controllers/member.auth.controller');
const { signUpMiddleware, verifyEmailMiddleware, memberLoginMiddleware, forgetPasswordMiddleware } = require('../middlewares/member.middleware');
const verifyMember = require('../utils/verifyMember');
const memberAuthRoute = express.Router();

memberAuthRoute.post("/register", signUpMiddleware ,signUp)
memberAuthRoute.post("/verify_email", verifyMember ,verifyEmailMiddleware ,verifyEmail)
memberAuthRoute.post("/login",memberLoginMiddleware,login)
memberAuthRoute.post("/logout",verifyMember ,logout)
memberAuthRoute.post("/forget_password", forgetPasswordMiddleware,forgetPassword)
memberAuthRoute.post("/reset_password/:token", resitPassword)

module.exports = memberAuthRoute


