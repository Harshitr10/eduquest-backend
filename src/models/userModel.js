const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    libId: { type: String, required: true },
    batch : {type: Number, required: true},
    branch: {
      type: String,
      enum: ["CSE","IT","CSIT","CS","CSE(AI)", "CSE(AIML)","ECE","EN","Civil","MCA"],
    },
    rollNo: { type: Number },
    section: { type: String, enum: ["A", "B", "C", "D"] },
    userImg: { type: String },
    codechefId: { type: String },
    leetcodeId: { type: String },
    codeforcesId: { type: String },
    githubId: { type: String },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
