import { useState, useRef, useEffect , useMemo } from "react";
import { motion, MotionConfig } from "motion/react"

const CmatCompo = ({ id  , handleDone , compocountRef , height , width, gotime }) => {
  const [moved, setMoved] = useState(false);
  const [text, setText] = useState("");
  const [lock, setLock] = useState(true);

  const randx = useMemo(() => {
    return Math.floor(Math.random() * (width - 2 + 1)) + 2;
  }, []);

  useEffect(()=>{
    console.log(height);
  },[])

  useEffect(() => {
    const chargen = () => {
      const maxlen = 20;
      const minlen = 10;
      const randlen = Math.floor(Math.random() * (maxlen - minlen + 1)) + minlen;
      let stringg = "";
      for (let i = 0; i < randlen; i++) {
        const randascii = Math.floor(Math.random() * (122 - 33 + 1)) + 33;
        stringg += String.fromCharCode(randascii);
      }
      setText(stringg);
    };

    chargen();
    setTimeout(() => setMoved(true), 0);
  }, []);

  useEffect(() => {
    if (text === "") return;
    if (lock) {
      let timee = 0;
      const interval = setInterval(() => {
        setLock(false);
        setText((prev) => {
          const randascii = Math.floor(Math.random() * (122 - 33 + 1)) + 33;
          return prev.slice(1) + String.fromCharCode(randascii);
        });
        timee += 100;
        if (timee > gotime.current*1000) {
          handleDone(id);
          compocountRef.current -= 1;
          clearInterval(interval);
        }
      }, 100);
    }
  }, [text, lock]);

  return (
    <motion.div
      initial={{ left: randx, top: -500 }}
      animate={{ top: moved ? height*1.5 : -500 }}
      transition={{ duration: gotime.current, ease: "linear" }}
      className="absolute w-screen h-screen z-50 flex flex-col select-none"
    >
      {text.split("").map((char, index) => (
        <div key={index} className="text-green-500">
          {char}
        </div>
      ))}
    </motion.div>
  );
};

const CMatrix = ({height , width , status}) => {

  const [components, setComponents] = useState([]);
  const intervalStarted = useRef(false);
  const compocount = useRef(0);
  const goheight = useRef(0);
  const gotime = useRef(0);
  const [statusstate , setstatusstate] = useState(status);


   const addComponent = () => {
    const id = crypto.randomUUID();
    setComponents((prev) => [...prev, { id }]);
    compocount.current += 1;
  };

  // Start interval only once
  let totalcomp = 0;
  useEffect(()=>{
     console.log("status: ", status);
    if(!(status)) return;

    if(width>1024){
        totalcomp = 500;
        gotime.current = (3/730)*height;
    }

    else if(width > 768){
        totalcomp = 200;
         gotime.current = (3/730)*height;
        }

    else if(width > 640){
        totalcomp = 100;
         gotime.current = (2/771)*height;
    }
    else{
        totalcomp = 40;
        gotime.current = (2/771)*height;
    }

    if (intervalStarted.current) return;
      intervalStarted.current = true;
      const cmatinterval = setInterval(() => { 
        if(compocount.current < totalcomp)
              addComponent();
          else{
            console.log("not adding");
        }
      }
    , 50);
  },[status])
  
  
//   useEffect(() => {
   
//   }, []);

  const handleDone = (id) => {
    setComponents((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {components.map((item) => (
        <CmatCompo key={item.id} id={item.id} handleDone={handleDone} compocountRef={compocount} height={height} width={width} gotime={gotime} />
      ))}
    </div>
  );
};

export default CMatrix;
