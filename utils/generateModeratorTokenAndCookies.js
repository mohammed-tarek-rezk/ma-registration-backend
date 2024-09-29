const jwt = require("jsonwebtoken");

const generateModeratorTokenAndCookies = (res , payload)=>{
    const token = jwt.sign(payload , process.env.JWT_SECRET ,{
        expiresIn: '11d'
    })
    res.cookie("moderatorToken" , token , {
        httpOnly: true ,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 11 * 1000 
    })

    return token;
}


module.exports = generateModeratorTokenAndCookies;