const Room = require("../models/Room");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", async (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on("cursor-move", ({ roomId, x, y, username }) => {
      socket.to(roomId).emit("cursor-move", { id: socket.id, x, y, username });
    });

    socket.on("draw-start", async ({ roomId, ...data }) => {
      socket.to(roomId).emit("draw-start", data);
      await Room.findOneAndUpdate(
        { roomId },
        {
          $push: { drawingData: { type: "start", data } },
          $set: { lastActivity: new Date() },
        }
      );
    });

    socket.on("draw-move", async ({ roomId, ...data }) => {
      socket.to(roomId).emit("draw-move", data);
      // await Room.findOneAndUpdate(
      //   { roomId },
      //   {
      //     $push: { drawingData: { type: "stroke", data } },
      //     $set: { lastActivity: new Date() },
      //   }
      // );
    });

    socket.on("draw-end", async ({ roomId, strokes }) => {
      socket.to(roomId).emit("draw-end");
      const formattedData = strokes.map(({ type, x, y, color, lineWidth }) => ({
        type,
        data: { x, y, color, lineWidth },
      }));
      if (strokes.length <= 0) return;
      await Room.findOneAndUpdate(
        { roomId: strokes[0].roomId },
        {
          $push: {
            drawingData: {
              $each: formattedData,
            },
          },
          $set: {
            lastActivity: new Date(),
          },
        }
      );
    });

    socket.on("clear-canvas", async (roomId) => {
      socket.to(roomId).emit("clear-canvas");
      await Room.findOneAndUpdate(
        { roomId },
        {
          $push: { drawingData: { type: "clear" } },
          $set: { lastActivity: new Date() },
        }
      );
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
