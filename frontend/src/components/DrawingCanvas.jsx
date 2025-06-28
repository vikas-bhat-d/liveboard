import React, { useEffect, useRef } from "react";
import { useCanvas } from "../providers/Canvas";
import { useSocket } from "../providers/Socket";
import axiosInstance from "../utils/axios";

const strokes = [];

const DrawingCanvas = () => {
  const { canvasRef, ctxRef, color, lineWidth, roomId, username } = useCanvas();
  const socket = useSocket();
  const drawing = useRef(false);

  useEffect(() => {
    socket.emit("join-room", roomId);
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    const fetchRoomData = async () => {
      if (!socket) return;
      try {
        const res = await axiosInstance.get(`/api/rooms/${roomId}`);
        const { drawingData } = res.data;
        drawingData.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        // console.log(drawingData);

        let prev = null;
        drawingData.forEach((command) => {
          if (command.type === "clear") {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            prev = null;
          } else if (command.type == "start") {
            console.log("found starting", command);
            ctx.beginPath();

            ctx.strokeStyle = command.data.color;
            ctx.lineWidth = command.data.line;
            ctx.moveTo(command.data.x, command.data.y);
            prev = { x: command.data.x, y: command.data.y };
            ctx.closePath();
          } else if (command.type === "stroke") {
            const { x, y, color, lineWidth } = command.data;
            if (prev == null) {
              prev = { x, y };
              return;
            }
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            if (prev) {
              ctx.moveTo(prev.x, prev.y);
              ctx.lineTo(x, y);
              ctx.stroke();
            }
            ctx.closePath();
            prev = { x, y };
          }
        });
      } catch (err) {
        console.error("Error loading drawing data:", err);
      }
    };

    fetchRoomData();

    socket.on("draw-start", ({ x, y, color, lineWidth }) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.moveTo(x, y);
    });

    socket.on("draw-move", ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    socket.on("draw-end", () => {
      ctx.closePath();
    });

    socket.on("clear-canvas", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("draw-start");
      socket.off("draw-move");
      socket.off("draw-end");
      socket.off("clear-canvas");
    };
  }, [roomId, socket]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    drawing.current = true;
    ctxRef.current.beginPath();
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = lineWidth;
    ctxRef.current.moveTo(offsetX, offsetY);

    socket.emit("draw-start", {
      roomId,
      x: offsetX,
      y: offsetY,
      color,
      lineWidth,
    });
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    socket.emit("cursor-move", { roomId, x: offsetX, y: offsetY, username });
    if (!drawing.current) return;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
    strokes.push({
      roomId,
      x: offsetX,
      y: offsetY,
      color,
      lineWidth,
      type: "stroke",
    });
    socket.emit("draw-move", {
      roomId,
      x: offsetX,
      y: offsetY,
      color,
      lineWidth,
    });
  };

  const handleMouseUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    ctxRef.current.closePath();
    socket.emit("draw-end", { roomId, strokes });
    strokes.splice(0, strokes.length);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="border border-gray-300 bg-white rounded shadow"
    />
  );
};

export default DrawingCanvas;
