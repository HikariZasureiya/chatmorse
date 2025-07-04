import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "../src/pages/home"
import Room from "../src/pages/room"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App



