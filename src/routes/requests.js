const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/send/:status/:receiverId", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { receiverId } = req.params;
    const status = req.params.status || "interested";
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: `Invalid status type: ${status}` });
    }

    // if the receivedId is invalid or not found in the users collection
    const validReceiverId = await User.findOne({ _id: receiverId });
    if (!validReceiverId) {
      return res.status(404).json({ message: "Receiver user not found" });
    }

    // if there is already a request between two same users or to self, do not create a new one
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { senderId: loggedInUserId, receiverId },
        { senderId: receiverId, receiverId: loggedInUserId }
      ],
    });
    if (existingRequest) {
      return res
        .status(409)
        .json({ message: "Connection request already exists" });
    }
    const connectionRequest = new ConnectionRequest({
      senderId: loggedInUserId,
      receiverId,
      status,
    });
    const connectionData = await connectionRequest.save();
    res.status(201).json({
      message: `${status} request sent successfully`,
      data: connectionData,
    });
  } catch (error) {
    console.error("Error sending interest request:", error);
    return res.status(500).send("Internal Server Error");
  }
});

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try{
    const loggedInUserId = req.user._id;
    console.log("Logged in user ID:", loggedInUserId);
    const allowedStatus = ["accepted", "rejected"];
    const { status, requestId } = req.params;
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: `Invalid status type: ${status}` });
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      receiverId: loggedInUserId,
      status: "interested",
    });
    if (!connectionRequest) {
      return res
        .status(404)
        .json({ message: "Connection request not found",});
    }
    connectionRequest.status = status;
    const updatedRequest = await connectionRequest.save();
    res.status(200).json({
      message: `Connection request ${status} successfully`,
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error reviewing connection request:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = requestRouter;
