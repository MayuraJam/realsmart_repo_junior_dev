const mongoose = require("mongoose");
const TokenScrema = mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        required : true,
        ref:"User"
    },
    token:{
        type:String,
        required : true,
    },
    createdAt :{
        type:Date,
        default:Date.now,
        expires : 3600
    }
})

const TokenModel = mongoose.model("Token", TokenScrema, "token");
module.exports = TokenModel;