const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

const swapSchema = new mongoose.Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sender_book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  receiver_book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  date_created: { type: Date, default: Date.now },
  date_updated: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending",
  },
});

const Swap = mongoose.model("Swap", swapSchema);


// Middleware to update date_updated on findOneAndUpdate
Swap.pre('findOneAndUpdate', function(next) {
  this.set({ date_updated: Date.now() });
  next();
});

// Middleware to update date_updated on updateOne
Swap.pre('updateOne', function(next) {
  this.set({ date_updated: Date.now() });
  next();
});


const insertSwap = async (swap) => {
  const newSwap = {
    sender: ObjectId.createFromHexString(swap.sender),
    receiver: ObjectId.createFromHexString(swap.receiver),
    sender_book: ObjectId.createFromHexString(swap.sender_book),
    receiver_book: ObjectId.createFromHexString(swap.receiver_book),
  };

  return await new Swap(newSwap).save();
};

const findAllSwapsByUserId = async (userId) => {
  return await Swap.find({
    $or: [
      { sender: ObjectId.createFromHexString(userId) },
      { receiver: ObjectId.createFromHexString(userId) },
    ],
  })
    .sort({ date_updated: -1 })
    .populate("sender")
    .populate("receiver")
    .populate("sender_book")
    .populate("receiver_book");
};

const updateSwapStatus = async (swapId, status) => {
  // updateOne returns query result obj with details about the update operation
  const result = await Swap.updateOne({ _id: ObjectId.createFromHexString(swapId) }, { status });
  // if document does not exist modify count will be 0
  return result.matchedCount > 0;
};

module.exports = { insertSwap, findAllSwapsByUserId, updateSwapStatus };
