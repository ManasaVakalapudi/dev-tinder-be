const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const safeFields = "firstName lastName about skills";

//pending requests
userRouter.get("/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connectionRequests = await ConnectionRequest.find({
      receiverId: loggedInUserId,
      status: "interested",
    }).populate("senderId", safeFields);
    res.json({ data: connectionRequests });
  } catch (error) {
    console.error("Error fetching user requests:", error);
    return res.status(500).send("Internal Server Error");
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connections = await ConnectionRequest.find({
      $or: [
        { receiverId: loggedInUserId, status: "accepted" },
        { senderId: loggedInUserId, status: "accepted" },
      ],
    }).populate("senderId", safeFields);
    const userConnectionData = connections.map((connection) => connection.senderId);
    res.json({ data: userConnectionData });
  } catch (error) {
    console.error("Error fetching user connections:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = userRouter;
