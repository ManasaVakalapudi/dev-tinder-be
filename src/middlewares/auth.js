const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //Read the token from the req.cookies
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).send("Unauthorized");
    }
    const decodedToken = jwt.verify(token, "jwtSecretKey");
    const { _id } = decodedToken;
    const user = await User.findById(_id);
    if (!user) {
      res.status(401).send("User not found, please login again");
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in userAuth middleware:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = { userAuth };
