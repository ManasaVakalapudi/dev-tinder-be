const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");
const User = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).send("Internal Server Error");
  }
});

profileRouter.patch('/profile/edit', userAuth, async(req,res)=>{
  console.log('req.user', req.user);
  try{
    if(!validateEditProfileData(req)){
        return res.status(400).send("Invalid fields in edit profile request");
    }
    let userData=req.user;
    Object.keys(req.body).forEach((key)=> {userData[key]=req.body[key]});

    await userData.save();
    res.json({message: "Profile updated successfully", data: userData});

  } catch(error){
    console.error("Error editing user profile:", error);
    return res.status(500).send("Internal Server Error");
  }
}); 

profileRouter.post('/profile/forgotPassword', async(req,res)=>{
  const {emailId, newPassword} = req.body;
  try{
    const user = await User.findOne({emailId});
    if(!user){
        return res.status(404).send("User not found");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.json({message: "Password updated successfully"});
  } catch(error){
    console.error("Error in forgot password:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = profileRouter;
