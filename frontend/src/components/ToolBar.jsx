import React, { useEffect, useState } from "react";
import { useCanvas } from "../providers/Canvas";
import { useSocket } from "../providers/Socket";
import { toast } from "react-toastify";

function Toolbar() {
  const {
    color,
    lineWidth,
    setColor,
    setLineWidth,
    ctxRef,
    canvasRef,
    roomId,
    username,
    setUserName,
  } = useCanvas();
  const socket = useSocket();

  const colors = ["black", "red", "blue", "green"];

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("my_modal_5").showModal();
    }, 500);
  }, []);

  const handleClear = (e) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx) return;
    socket.emit("clear-canvas", roomId);
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    localStorage.setItem("liveboard-user", username);
  }, [username]);

  useEffect(() => {
    const modal = document.getElementById("my_modal_5");

    const handleClose = () => {
      toast.info(`You are visible as ${username}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    };

    if (modal) {
      modal.addEventListener("close", handleClose);
    }

    return () => {
      if (modal) {
        modal.removeEventListener("close", handleClose);
      }
    };
  }, [username]);

  return (
    <div className="flex items-center gap-6 p-4 bg-gray-100 border rounded shadow mb-4">
      {/* Color Picker */}

      <>
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Set your username:</h3>
            <input
              type="text"
              className="input mt-2"
              value={username}
              onChange={(e) => {
                console.log(e.target.value);
                setUserName((prev) => e.target.value);
              }}
              autoFocus="true"
            />
            <p className="py-4">
              Press ESC key or click the button below to close
            </p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </>
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_5").showModal()}
      >
        change username
      </button>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">Color:</span>
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-6 h-6 rounded-full border-2 ${
              color === c ? "border-black" : "border-white"
            }`}
            style={{ backgroundColor: c }}
          ></button>
        ))}
      </div>

      {/* Line Width Slider */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">Line Width:</span>
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          className="w-32"
        />
        <span>{lineWidth}px</span>
      </div>

      <button className="btn" onClick={handleClear}>
        clear
      </button>
    </div>
  );
}

export default Toolbar;
