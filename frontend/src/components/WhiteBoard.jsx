//i need to send the request to the api end point /join with roomId taken from useParams.
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCanvas } from "../providers/Canvas";
import DrawingCanvas from "./DrawingCanvas";
import Toolbar from "./Toolbar";
import axiosInstance from "../utils/axios";
import UserCursors from "./UserCursors";

const Whiteboard = () => {
  const { roomId } = useParams();
  const { setRoomId } = useCanvas();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {} = useCanvas();

  useEffect(() => {
    const joinRoom = async () => {
      try {
        const response = await axiosInstance.post("/api/rooms/join", {
          roomId,
        });
        console.log(response);
        if (response.status === 200) {
          setRoomId(roomId);
        }
      } catch (err) {
        setError("Failed to join or create room");
      } finally {
        setLoading(false);
      }
    };

    joinRoom();
  }, [roomId, setRoomId]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Toolbar />
      <DrawingCanvas />
      <UserCursors />
    </div>
  );
};

export default Whiteboard;
