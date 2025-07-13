import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "../src/pages/home"
import Room from "../src/pages/room"
import Pubpage from './pages/pubpage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/findrooms" element={<Pubpage />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App



