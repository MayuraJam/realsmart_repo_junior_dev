const mongoose = require("mongoose");

const DataScrema = mongoose.Schema({
    publisheddate : {
        type: String
    },
    keyword : {
        type: Array
    },
    engagement_view :{
        type:Number
    },
    engagement_comment :{
        type:Number
    },
    engagement_share :{
        type:Number
    },
    engagement_like :{
        type:Number
    },
    engagement_love :{
        type:Number
    },
    engagement_sad :{
        type:Number
    },
    engagement_wow :{
        type:Number
    },
    engagement_angry :{
        type:Number
    },
})