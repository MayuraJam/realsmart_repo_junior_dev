
const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const handleError = require("../util/validate");
const bcrypt = require("bcrypt");

const maxAgeToken = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAgeToken,
  });
};
const createNewUser = async (req, res) => {
  const reqBody = req.body;
  const { email, password } = reqBody;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = await UserModel.create({
      email,
      password,
      passwordFromClient: password,
    });
    const token = createToken(user._id);
    console.log("token :", token);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAgeToken * 1000,
    });
    res.status(201).json({
      massage: "Create new User success!",
      userResponse: user,
      token: token,
    });
  } catch (error) {
    const errMessage = handleError(error);
    res.status(400).json({ errMessage });
  }
};

const login = async (req, res) => {
  const reqBody = req.body;
  const { email, password } = reqBody;
  try {
    const userLogin = await UserModel.login(email, password);
    console.log("user login", userLogin);

    const token = createToken(userLogin._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAgeToken * 1000,
    });

    res.status(200).json({ message: "Welcome to Dashboard page !!" });
  } catch (error) {
    const errMessage = handleError(error);
    res.status(400).json({ errMessage });
  }
};


const forgetPassword = async (req, res) => {
  const reqBody = req.body;
  const { email } = reqBody;
  try {
    const user = await UserModel.findOne({ email });
    console.log("find User : ", user);
    if (!user) {
      res.status(404).json({ message: "User does not exist" });
    }

    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAgeToken * 1000,
    });
    res.status(200).json({ message: "Next to reset password" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const passwordReset = async (req, res) => {
  try {
    const requestBody = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(requestBody.password,salt)
    const user = await UserModel.findByIdAndUpdate(
      requestBody.id,
      {
        password: hashPassword,
        passwordFromClient: requestBody.password
      },
      {
        new: true, 
        runValidators: true, 
      }
    );

    if (!user) {
      return res.status(404).json({ massage: `update password fail` });
    }
    const updateUser = await UserModel.findById(requestBody.id);

    res.status(200).json({ message: "reset password success!",data:updateUser});
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({
      massage: error.message || error,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.json({ message: "log out success!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNewUser,
  login,
  logout,
  forgetPassword,
  passwordReset,
};
