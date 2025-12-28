const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
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

//accepted connections
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connections = await ConnectionRequest.find({
      $or: [
        { receiverId: loggedInUserId, status: "accepted" },
        { senderId: loggedInUserId, status: "accepted" },
      ],
    })
      .populate("senderId", safeFields)
      .populate("receiverId", safeFields);
    const userConnectionData = connections.map((connection) => {
      if (connection.senderId._id.equals(loggedInUserId)) {
        return connection.receiverId;
      } else {
        return connection.senderId;
      }
    });
    res.json({ data: userConnectionData });
  } catch (error) {
    console.error("Error fetching user connections:", error);
    return res.status(500).send("Internal Server Error");
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // user shouldnt see in the feed:
    // himself
    // his connections
    // ignored users
    // pending requests
    const loggedInUserId = req.user._id;
    const excludedUserIds = new Set();
    excludedUserIds.add(loggedInUserId.toString());
    const userConnections = await ConnectionRequest.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    userConnections.forEach((connection) => {
      excludedUserIds.add(connection.senderId.toString());
      excludedUserIds.add(connection.receiverId.toString());
    });

    const usersInFeed = await User.find({
      _id: { $nin: Array.from(excludedUserIds) },
    }).select(safeFields);

    res.json({ data: usersInFeed });
  } catch (error) {
    console.error("Error fetching feed users:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = userRouter;
