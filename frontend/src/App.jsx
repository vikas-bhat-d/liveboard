import { useState } from "react";
import RoomJoin from "./components/RoomJoin";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Whiteboard from "./components/WhiteBoard";
import { CanvasProvider } from "./providers/Canvas";
import { SocketProvider } from "./providers/Socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<RoomJoin />} />
          <Route
            path="/room/:roomId"
            element={
              <CanvasProvider>
                <SocketProvider>
                  {" "}
                  <Whiteboard />
                </SocketProvider>
              </CanvasProvider>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
