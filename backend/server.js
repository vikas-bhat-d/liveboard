// server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const roomRoutes = require("./routes/roomRoutes");
const socketHandler = require("./socket/socketHandler");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/liveboard", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/rooms", roomRoutes);

// Socket
socketHandler(io);

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// models/Room.js
const mongoose = require("mongoose");

const DrawingCommandSchema = new mongoose.Schema({
  type: String, // 'stroke' or 'clear'
  data: Object,
  timestamp: { type: Date, default: Date.now },
});

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  drawingData: [DrawingCommandSchema],
});

module.exports = mongoose.model("Room", RoomSchema);

// routes/roomRoutes.js
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
