const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //reference to User model
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //reference to User model
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["pending", "accepted", "rejected", "ignored", "interested"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function(next){
  const connectionRequest = this;
  // check if senderId and receiverId are the same
  if(connectionRequest.senderId.equals(connectionRequest.receiverId)){
    throw new Error("senderId and receiverId cannot be the same");
  }
  next();
});

connectionRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const connectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = connectionRequestModel;