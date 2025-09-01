const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromeUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid status type`,
      },
    },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness of connection requests between two users
connectionRequestSchema.index({ fromeUserId: 1, toUserId: 1 });

// Pre-save hook to prevent self-connection requests

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if(connectionRequest.fromeUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send connection request to yourself");
  } 
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
