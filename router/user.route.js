const express = require("express");
const router = express.Router();
const {
  createNewUser,
  login,
  logout,
  forgetPassword,
  passwordReset,
} = require("../controller/user.controller");

router.post("/", createNewUser);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgetPassword);
router.post("/passwordReset", passwordReset);

module.exports = router;
