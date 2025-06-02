const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserScrema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter your Email"],
      unigue: true,
      lowercase: true,
      validator: [isEmail, "emailname@email.com"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [6, "Minimum password length is 6 characters"],
    },
    passwordFromClient: {
      type: String,
      minLength: [6, "Minimum password length is 6 characters"],
    },
    createDate: {
      type: Date,
    },
    updateDate: {
      type: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// การเข้ารหัสในตัวของรหัสผ่าน
UserScrema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password,salt);
  next();
});

UserScrema.post("save",function (doc,next){
    console.log("new user was crated & save", doc);
    next();
})

//login
UserScrema.statics.login = async function (email,password){
    const user = await this.findOne({email});
    if(!user){
      throw Error("Incorrect Email");
    }
    const matchPassword = await bcrypt.compare(password,user.password);
    if(!matchPassword){
      throw Error("Incorrect Password");
    } 
    return user;
}

// UserScrema.methods.createResetPasswordToken = ()=>{
//     const resetToken =  
// }



const UserModel = mongoose.model("User", UserScrema, "user");
module.exports = UserModel;
