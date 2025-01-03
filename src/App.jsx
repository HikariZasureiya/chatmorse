import { useState , useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Click = ({setChild , setStrii , stringRef , display})=>{


  let clicked = 0;
  let unclicked = 0;
  let string = '';

  let downevent = null;
  let upevent = null;
  
  const typein = ()=>{

        if (upevent)
          clearInterval(upevent);
        if (unclicked >= 560){
         string+='/' 
        }
        else if (unclicked >= 240){
          string+=' '; 
         }
        unclicked = 0;
        display.current.innerHtml = string;
        
        stringRef.current = string;
        


    
    downevent = setInterval(() => {
      clicked +=10;
    }, 10);
  }

  const typeout = ()=>{
    if(downevent){
        clearInterval(downevent);
        if(clicked >= 240){
          string+='-';    
        }
        else{
          string+='.'
          
        }
        display.current.innerHTML = string;

        clicked = 0;
      }
      stringRef.current = string;

      console.log(string);
  
    
    upevent = setInterval(() => {
      unclicked +=10;

      if(unclicked >= 3000){
        clearInterval(upevent);
        unclicked = 0;
        setChild((prev)=>{
          var gg = prev;
          gg.push(<div>{string}</div>);

          return gg;
        })

        display.current.innerHTML = string;
        string = '';
      }
    }, 10);
  }


  return(<>
  <button onMouseDown={(e)=>{typein();}} 
    onMouseUp={typeout}>GG</button>

  </>)


}


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
     </div>
    </>
  )
}

export default App
