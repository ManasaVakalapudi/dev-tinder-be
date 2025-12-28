const express = require("express");
const connectDb = require("../config/database");
const app = express();
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const ConnectionRequest = require("./models/connectionRequest");
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/requests", requestRouter);
app.use("/user", userRouter);

//get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    console.log("users", users);
    if (users.length === 0) {
      return res.status(404).send("No users found");
    }
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).send("Internal Server Error");
  }
});

//get user by emailId
app.get("/user", async (req, res) => {
  try {
    const { emailId } = req.body;
    const userFound = await User.find({ emailId });
    if (userFound.length === 0) {
      return res.status(404).send("User not found");
    }
    res.send(userFound);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

//delete user by emailId
app.delete("/user", async (req, res) => {
  const { userId } = req.body;
  try {
    console.log("userId", req.body.userId);
    const deleteUser = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

//update user by id
app.patch("/user", async (req, res) => {
  const { firstName } = req.body;
  const { userId } = req.body;
  const data = req.body;

  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "phone",
      "password",
      "age",
    ];
    const isUpdateAllowed = Object.keys(data).every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isUpdateAllowed) {
      return res.status(400).send("Invalid update");
    }
    if (data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await User.findByIdAndUpdate(
      userId,
      { firstName },
      { new: true, runValidators: true }
    );
    res.send("user updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

//get all connections and connection requests of all users
app.get('/allConnections', async(req,res)=>{
  try{
    const allConnections = await ConnectionRequest.find({}).populate("senderId", "emailId").populate("receiverId", "emailId");
    res.json({data: allConnections});
  } catch(error){
    console.error("Error fetching all connections:", error);
    return res.status(500).send("Internal Server Error");
  }
})

app.get('/',(req,res)=>{
  res.send("Welcome to DevTinder Backend");
})

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7000, () => {
      console.log("Server is running on port 7000");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
