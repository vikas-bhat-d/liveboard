const express = require("express");
const Room = require("../models/Room");
const router = express.Router();

router.post("/join", async (req, res) => {
  const { roomId } = req.body;
  try {
    let room = await Room.findOne({ roomId });
    if (!room) {
      room = await Room.create({ roomId });
    }
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: "Failed to join room" });
  }
});

router.get("/:roomId", async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "Failed to get room info" });
  }
});

module.exports = router;
