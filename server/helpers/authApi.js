var mongoose = require("mongoose");
const userSchema = require("../models/userModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const userDataCollection = mongoose.model("user", userSchema, "users");

const authAPI = async function (req, res, next) {
  const authHeader = req.header("authorization");

  try {
    const token = authHeader.split(" ")[1];
    if (token == undefined) {
      throw new Error("not Authorized");
    }

    jwt.verify(token, process.env.PUBLICKEY, async function (err, decoded) {
      console.log(err);
      if (err) {
        res.status(400).send({ message: "Unauthorized Request insider" });
        // throw err;
      } else {
        console.log(decoded);
        var isUser = await userDataCollection
          .findOne({ email: decoded.email, password: decoded.password })
          .exec();
        console.log(isUser);
        if (isUser != null) {
          req.body.userId = decoded.userId;
          req.body.email = decoded.email;
          req.body.password = decoded.password;
          req.body.role = decoded.role;
          next();
        } else {
          throw new Error("not authorized");
        }
      }
    });
  } catch (e) {
    res.status(400).send({ message: "Unauthorized Request" });
  }
};

module.exports = {
  authAPI,
};
