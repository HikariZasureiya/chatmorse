import { useState , useRef, useEffect } from 'react'

 export default function({setChild , setStrii , stringRef , display}){
  

  const [clicked , SetClicked] = useState(0);
  const [unclicked , setUnclicked] = useState(0);
  const [string , SetString] = useState('');
  const [downevent , setDownevent] = useState(null);
  const [upevent , setUpevent] = useState(null);
  const clickedRef = useRef(clicked);
  const unclickedRef = useRef(unclicked);


// store the mousedown time in a reference using useEffect to avoid bugs ;( 
  useEffect(() => {
    clickedRef.current = clicked;
  }, [clicked]);
// same as above but for unclicked
  useEffect(() => {
    unclickedRef.current = unclicked;
  }, [unclicked]);


  // update Strii as needed
  useEffect(()=>{
    setStrii(string);
  },[string])

 
  // typein checks for unclicked value to seperate letters annd words
  const typein = ()=>{
       
        if (upevent){
          clearInterval(upevent);
          setUpevent(null);
        }

        if (unclickedRef.current >= 560){
         SetString((prev) => prev+'/'); 
        }
        else if (unclickedRef.current >= 240){
          SetString(prev => prev+' '); 
         }
        setUnclicked(0);

    

    // set interval to check for clickdown time spent
    const down = setInterval(() => {
      SetClicked(prev => prev+10);
    }, 10);

    setDownevent(down);
  }
  // works same as typein but adds the main dits and dahs to the string
  const typeout = ()=>{

    if(downevent){
        clearInterval(downevent);
        if(clickedRef.current >= 240){
          SetString(prev => prev+'-');    
        }
        else{
          SetString(prev => prev+'.');
          
        }
        

        SetClicked(0);
      }

  
    
    const up = setInterval(() => {
      setUnclicked((prev) => prev+10);

      // clears string after 3 seconds of inactivity
      if(unclickedRef.current >= 3000){
        clearInterval(up);
        setUpevent(null);
        setUnclicked(0);
        SetString('');
      }

    }, 10);

    setUpevent(up);
    
  }


  return(<>
  <button onMouseDown={(e)=>{typein();}} 
    onMouseUp={typeout}>GG</button>

  </>)


}

