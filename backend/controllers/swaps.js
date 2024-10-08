const {
  insertSwap,
  findAllSwapsByUserId,
  updateSwapStatus,
} = require("../models/swaps");
const { findUserById } = require("../models/users");
const { findBookById } = require("../models/books");
const mongoose = require("mongoose");
const { createNotification } = require("../models/notifications");

const acceptedStatuses = ["pending", "accepted", "rejected", "completed", "canceled"]

exports.getAllSwapsByUserId = async (req, res, next) => {
  const { user_id } = req.query;

  const user = await findUserById(user_id);
  if (!user) {
    return res
      .status(404)
      .send({ message: `User with ID'${user_id}' does not exist` });
  }

  try {
    const swaps = await findAllSwapsByUserId(user_id);
    res.status(200).send({ swaps });
  } catch (error) {
    console.error("Error getting swaps by userId", error);
    next(error);
  }
};

exports.createBookSwap = async (req, res, next) => {
  const { sender, receiver, sender_book, receiver_book } = req.body;

  if (!sender || !receiver || !sender_book || !receiver_book) {
    return res
      .status(400)
      .send({ message: "Please provide all required fields" });
  }

  if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(sender_book)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  const senderEntity = await findUserById(sender);
  const receiverEntity = await findUserById(receiver);
  if (!senderEntity || !receiverEntity) {
    return res.status(404).send({ message: `Non existent userId provided` });
  }

  const senderBookEntity = await findBookById(sender_book);
  const receiverBookEntity = await findBookById(receiver_book);
  if (!senderBookEntity || !receiverBookEntity) {
    return res.status(404).send({ message: `Non existent bookId provided` });
  }

  try {
    const insertedSwap = await insertSwap(req.body);

    // TODO: create notification to let receiver know about swap request
    const message = `New swap request: ${senderBookEntity.title} for ${receiverBookEntity.title}`;
    await createNotification({ user_id: receiver, message });

    res.status(201).send({ swap: insertedSwap });
  } catch (error) {
    console.error("Error inserting swap:", error);
    next(error);
  }
};

exports.updateSwap = async (req, res, next) => {
  const { swapId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(swapId)) {
    return res.status(400).send({ message: "Invalid swap ID format" });
  }
  const { status } = req.body;

  if (!status || !acceptedStatuses.includes(status)) {
    return res
      .status(400)
      .send({ message: "Please provide all required fields" });
  }
  try {
    const updatedSwap = await updateSwapStatus(swapId, status);
    if (!updatedSwap) {
      return res.status(404).send({ message: "Swap not found" });
    }

    // Create notifications based on the new status
    if (status === "accepted") {
      await createNotification({
        user_id: updatedSwap.sender._id,
        message: `Your swap request with ${updatedSwap.receiver.username} has been accepted.`,
        date_created: new Date()
      });
    } else if (status === "rejected") {
      await createNotification({
        user_id: updatedSwap.sender._id,
        message: `Your swap request with ${updatedSwap.receiver.username} has been rejected.`,
        date_created: new Date()
      });
    } else if (status === "canceled") {
      await createNotification({
        user_id: updatedSwap.receiver._id,
        message: `The swap request with ${updatedSwap.sender.username} has been canceled.`,
        date_created: new Date()
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error updating swap:", error);
    next(error);
  }
};
