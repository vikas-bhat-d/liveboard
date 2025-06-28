// UserCursors.jsx
import React, { useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import { useCanvas } from "../providers/Canvas";

const UserCursors = () => {
  const socket = useSocket();
  const { username } = useCanvas();

  const [cursors, setCursors] = useState({}); // id: { x, y, username }

  useEffect(() => {
    if (!socket) return;

    socket.on("cursor-move", ({ id, x, y, username: sender }) => {
      // Skip own cursor

      //   if (sender === username) return;
      console.log("test");
      setCursors((prev) => ({
        ...prev,
        [id]: { x, y, username: sender },
      }));
    });

    // Optional: clean up disconnected cursors after some time
    const interval = setInterval(() => {
      setCursors((prev) => {
        const newMap = {};
        Object.entries(prev).forEach(([id, data]) => {
          newMap[id] = data; // Or add logic to remove old ones
        });
        return newMap;
      });
    }, 10000);

    console.log("from coursers");
    return () => {
      socket.off("cursor-move");
      clearInterval(interval);
    };
  }, [socket, username]);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
      {Object.entries(cursors).map(([id, { x, y, username }]) => (
        <div
          key={id}
          className="absolute"
          style={{
            top: y,
            left: x,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-xs bg-white px-1 py-0.5 rounded shadow">
              {username}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCursors;
