const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler")


//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const apiKey = req.headers.authorization;
    if (apiKey !== `Bearer ${process.env.API_KEY}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const {
        username,
        branch,
        email,
        libId,
        batch,
        password,
        rollNo,
        section,
      } = req.body;
  
      // Check if the user is already registered
      const userAvailable = await User.findOne({ email });
      if (userAvailable) {
        return res.status(400).json({ error: "User already registered!" });
      }
  
      if (email.slice(-8) !== "kiet.edu") {
        console.log(email.slice(-8));
        return res.status(504).json({ error: "User email invalid" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed Password: ", hashedPassword);
  
      // Create the user
      const user = await User.create({
        username,
        branch,
        email,
        libId,
        batch,
        rollNo,
        section,
        password: hashedPassword,
      });
  
      const accessToken = jwt.sign(
        {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            branch: user.branch,
            libId: user.libId,
            batch :  user.batch,
            section : user.section
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
  
      // Send a success response
      return res
        .status(200)
        .json({ message: "User registered successfully", user, accessToken });
    } catch (error) {
      // Handle any errors that occur during registration
      console.error("Error:", error);
      return res.status(500).json({ error: "Registration failed" });
    }
  });
  
  //@desc Login user
  //@route POST /api/users/login
  //@access public
  const loginUser = asyncHandler(async (req, res) => {
    const apiKey = req.headers.authorization;
    if (apiKey !== `Bearer ${process.env.API_KEY}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
      }
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
          {
            user: {
              id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            branch: user.branch,
            libId: user.libId,
            batch :  user.batch,
            section : user.section
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        res.status(200).json({ accessToken });
      } else {
        res.status(401);
        throw new Error("email or password is not valid");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
module.exports = {
    registerUser,
    loginUser,
  };