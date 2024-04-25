const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  updateDetails,
  updatePassword,
} = require("../controller/userController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/myprofile", auth, getProfile);
router.patch("/update-details", auth, updateDetails);
router.patch("/update-password", auth, updatePassword);

module.exports = router;
