import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Room from "../src/pages/home"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Room />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App



