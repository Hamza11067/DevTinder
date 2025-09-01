const express = require('express');
const requestRouter = express.Router();

const {userAuth} = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromeUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value " + status });
    }

    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromeUserId, toUserId },
        { fromeUserId: toUserId, toUserId: fromeUserId }
      ]
    });

    if (existingConnectionRequest) {
      return res.status(400).json({ message: "Connection request already exists between these users" });
    }

    const connectionRequest = new ConnectionRequestModel({
      fromeUserId,
      toUserId,
      status
    })

    const data = await connectionRequest.save();

    res.json({
      message : "Connection request sent successfully",
      data
    })

  } catch (error) {
    res.send("Error" + error.message);
  }
});

module.exports = requestRouter;