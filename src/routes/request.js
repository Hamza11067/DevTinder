const express = require('express');
const requestRouter = express.Router();

const {userAuth} = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromeUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value " + status });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "ToUser not found" });
    }

    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromeUserId: fromeUserId, toUserId: toUserId },
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
    res.send("Error " + error.message);
  }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const status = req.params.status; 
    const requestId = req.params.requestId;
    const loggedInUser = req.user;
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      return res.send("Status not allowed")
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    })

    if(!connectionRequest){
      return res.send("No connection request found");
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({
      message: "Connection request " + status,
      data
    })
  } catch (error) {
    res.status(400).send("Error " + error)
  }
})

module.exports = requestRouter;