const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
});
const User = mongoose.model('User', userSchema);
const findUserByName = (username) => {
  return User.findOne({ username })
}

const findUserById = (userId) => {
  return User.findById(ObjectId.createFromHexString(userId))
}

const findAllUsers = () => User.find({})

module.exports = { User, findUserByName, findAllUsers, findUserById }