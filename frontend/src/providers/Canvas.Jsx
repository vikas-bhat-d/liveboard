import React, {
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";

const CanvasContext = createContext(null);

export const useCanvas = () => {
  return useContext(CanvasContext);
};

export const CanvasProvider = ({ children }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(2);
  const [roomId, setRoomId] = useState("default123");
  const [username, setUserName] = useState(
    localStorage.getItem("liveboard-user") || "John Doe"
  );
  const [openModal, setOpenModal] = useState(true);

  const value = useMemo(
    () => ({
      canvasRef,
      ctxRef,
      color,
      setColor,
      lineWidth,
      setLineWidth,
      roomId,
      setRoomId,
      username,
      setUserName,
      openModal,
      setOpenModal,
    }),
    [color, lineWidth, roomId, username, openModal]
  );

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};
