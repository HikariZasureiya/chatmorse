import { useState , useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Click from './components/Transmitter.jsx'



function App() {
  
  const display = useRef();
  const [childiv , setChild] = useState([]);
  const [strii , setStrii] = useState('');
  const stringRef = useRef('');

  return (
    <>
     <Click
      setChild={setChild}
      setStrii={setStrii}
      stringRef={stringRef}
      display={display}
     />

     <div ref = {display}>
      String is: {strii}
     </div>
    </>
  )
}

export default App
