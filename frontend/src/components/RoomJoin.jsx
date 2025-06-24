import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RoomJoin() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  return (
    <div className="flex flex-col-reverse md:flex-row items-center px-5 sm:px-8 md:px-16 lg:px-32 ">
      <div className="h-full flex flex-col justify-center items-start gap-5 text-center md:text-left">
        <h2 className="text-4xl font-bold text-primary">
          Sketch Ideas Together on LiveBoard
        </h2>
        <p className="text-2xl text-gray-700">
          A real-time collaborative whiteboard to brainstorm, draw, and share in
          sync — all from your browser.
        </p>
        <div className="flex items-center justify-center gap-2 ">
          <input
            type="text"
            placeholder="Ex: Holy Knights"
            className="input input-lg"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <div className="">
            <button
              className="bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-opacity-90 transition"
              onClick={(e) => {
                navigate(`/room/${roomId}`);
              }}
            >
              Create/Join
            </button>
          </div>
        </div>
      </div>
      <div>
        <img
          src="/chat-illustration.svg"
          alt="LiveBoard Illustration"
          className="h-128"
        />
      </div>
    </div>
  );
}

export default RoomJoin;
