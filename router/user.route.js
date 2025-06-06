const express = require("express");
const router = express.Router();
const {
  createNewUser,
  login,
  logout,
  forgetPassword,
  passwordReset,
} = require("../controller/user.controller");
const requireAuth = require("../middleware/authMiddleware");

router.post("/", createNewUser);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgetPassword);
router.put("/passwordReset", passwordReset);
router.get("/", requireAuth, (req, res) => {
  res.status(200).json(req.user);
});


module.exports = router;
