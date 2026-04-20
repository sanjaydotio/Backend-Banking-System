const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "userName is Required"],
    unique: true,
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "email is Required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
});

userSchema.pre("save", async function (req,res,next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password , 12)
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password , this.password)
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel