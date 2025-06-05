const jwt = require('jsonwebtoken');
const UserModel = require("../model/user.model");
require("dotenv").config();

const requireAuth = async(req,res,next)=>{
   const token = req.cookies.jwt;
    if(!token){
        return res.status(401).json({message:'Token not found in cookie.'});
    }
    try {
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const userData = await UserModel.findById(decoded.id);
        req.user = userData;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

module.exports = requireAuth;