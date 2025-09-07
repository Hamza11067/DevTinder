const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const SAFE_USER_FIELDS = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photoUrl",
  "skills",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_FIELDS);

    res.json({
      message: "Connection requests retrieved successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error " + error);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_FIELDS)
      .populate("toUserId", SAFE_USER_FIELDS);

    const data = connections.map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        return connection.toUserId;
        } else {
        return connection.fromUserId;
        }
    });

    res.json({
      message: "Connections retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(400).send("Error " + error);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id},
        { toUserId: loggedInUser._id}
      ],
    }).select("fromUserId toUserId");

    
    const hiddenUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hiddenUsersFromFeed.add(request.fromUserId.toString());
      hiddenUsersFromFeed.add(request.toUserId.toString());
    });

    hiddenUsersFromFeed.add(loggedInUser._id.toString());

    console.log(hiddenUsersFromFeed);

    res.send("Feed endpoint is under construction");

  } catch (error) {
    res.status(400).send("Error " + error);
  }
});
module.exports = userRouter;
