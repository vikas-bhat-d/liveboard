import { useState } from "react";
import RoomJoin from "./components/RoomJoin";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoomJoin />} />
          <Route path="/room/:roomId" element={<>test route</>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
