import { useState , useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Click from './components/Transmitter.jsx'



function App() {
  
  const display = useRef();
  const [strii , setStrii] = useState('');
  const [textstr , SetTextStr] = useState('');

  return (
    <div className="flex">
     <Click
      setStrii={setStrii}
      SetTextStr = {SetTextStr}
     />

     <div ref = {display} 
      style={{marginBottom:'20px' , marginTop:'10px'}}
     >
      Morse: {strii}
     </div>

     <div >
      Text: {textstr}
     </div>
    </div>
  )
}

export default App
