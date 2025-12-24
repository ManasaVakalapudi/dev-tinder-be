const express = require("express");
const { validateSignupData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  console.log("Signup request body:", req.body);
  try {
    const { firstName, lastName, emailId, password, age, gender, phone } =
      req.body;
    validateSignupData(req);
    // password encryption
    const passwordHash = await bcrypt.hash(password, 10);
    // create new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      phone,
    });
    await user.save();
    res.send("User signed up successfully");
  } catch (error) {
    console.error("Error signing up user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email format");
    }
    const user = await User.findOne({ emailId });
    const isPasswordValid = await user.validatePassword(password);
    if (!user || !isPasswordValid) {
      throw new Error("Invalid Credentials");
    } else {
        //generate a jwt token and send it to user
        const token = user.getJWT();
        res.cookie("token", token, { httpOnly: true, secure: true, expires: new Date(Date.now() + 3600000) }); //1 hour
    }
    res.send("User logged in successfully");
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = authRouter;
