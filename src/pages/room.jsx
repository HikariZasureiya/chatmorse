import { useState, useRef, useEffect } from "react";
import Click from "../components/Transmitter";
import morsetotext from "../assets/morsetotext.json";
import texttomorse from "../assets/texttomorse.json";
import { motion } from "motion/react";
function Room() {
  const display = useRef();
  const dur = 3000;
  const [strii, setStrii] = useState("");
  const [textstr, SetTextStr] = useState("");
  const [curmode, setCurmode] = useState("");
  const curmodeRef = useRef(curmode);
  const [tl, settl] = useState(0);
  const tlref = useRef(tl);
  const [lindisp, setlindisp] = useState(false);
  const lindispref = useRef(lindisp);
  const [delbut , setdelbut] = useState(false);

  // Don't even dare touch this. it just works
  const [clicked, SetClicked] = useState(0);
  const clickedRef = useRef(clicked);
  const [unclicked, setUnclicked] = useState(0);
  const unclickedRef = useRef(unclicked);
  const [string, SetString] = useState("");
  const stringRef = useRef(string);
  const [mstring, SetmString] = useState("");
  const mstringRef = useRef(mstring);
  const [downevent, setDownevent] = useState(null);
  const downeventRef = useRef(downevent);
  const [upevent, setUpevent] = useState(null);
  const upeventRef = useRef(upevent);
  const [temp, setTemp] = useState("");
  const tempRef = useRef(temp);
  const [mtemp, setmtemp] = useState("");
  const mtempref = useRef(mtemp);
  const [lock, setlock] = useState(true);
  const lockRef = useRef(lock);



  
  useEffect(()=>{
    if(delbut === true){
      clearInterval(upeventRef.current);
      clearInterval(downeventRef.current);
      setUpevent(null);
      setUnclicked(0);
      setTemp("");
      setmtemp("");
      SetString("");
      SetmString("");
      setStrii("");
      SetTextStr("");
      setUpevent(null);
      setDownevent(null);
      setdelbut(false);
      setlindisp(false);
    }
  },[delbut])

  useEffect(() => {
    clickedRef.current = clicked;
  }, [clicked]);

  useEffect(() => {
    unclickedRef.current = unclicked;
  }, [unclicked]);

  useEffect(() => {
    downeventRef.current = downevent;
  }, [downevent]);

  useEffect(() => {
    upeventRef.current = upevent;
  }, [upevent]);

  useEffect(() => {
    lockRef.current = lock;
  }, [lock]);

  useEffect(() => {
    tempRef.current = temp;
  }, [temp]);

  useEffect(() => {
    mtempref.current = mtemp;
  }, [mtemp]);

  useEffect(() => {
    setStrii(string);
    stringRef.current = string;
  }, [string]);

  useEffect(() => {
    mstringRef.current = mstring;
  }, [mstring]);

  useEffect(() => {
    curmodeRef.current = curmode;
  }, [curmode]);

  useEffect(() => {
    tlref.current = tl;
  }, [tl]);

  useEffect(() => {
    lindispref.current = lindisp;
  }, [lindisp]);

  useEffect(() => {
    SetTextStr(() => {
      if (morsetotext.hasOwnProperty(temp)) return mstring + morsetotext[temp];
      else if (texttomorse.hasOwnProperty(temp)) return mstring + temp;
      else return mstring;
    });
  }, [mstring, temp]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      settl(0);
      setlindisp(false);
      setCurmode("keyboard");
      if (lockRef.current) {
        setlock(false);
        if (upeventRef.current) {
          clearInterval(upeventRef.current);
          setUpevent(null);
        }
        if (unclickedRef.current >= 560) {
          SetString(() => stringRef.current + "/");
          SetmString(() => {
            if (texttomorse.hasOwnProperty(tempRef.current)) {
              return mstringRef.current + tempRef.current + " ";
            } else if (morsetotext.hasOwnProperty(tempRef.current)) {
              return mstringRef.current + morsetotext[tempRef.current] + " ";
            } else return mstringRef.current + " ";
          });
          setTemp("");
          setmtemp("");
        } else if (unclickedRef.current >= 240) {
          SetString(() => stringRef.current + " ");
          SetmString(() => {
            if (texttomorse.hasOwnProperty(tempRef.current))
              return mstringRef.current + tempRef.current;
            else if (morsetotext.hasOwnProperty(tempRef.current))
              return mstringRef.current + morsetotext[tempRef.current];
            else return mstringRef.current;
          });
          setTemp("");
          setmtemp("");
        }
        setUnclicked(0);
        const down = setInterval(() => {
          SetClicked((prev) => prev + 10);
        }, 10);
        setDownevent(down);
      }
    };
    const handleKeyUp = (event) => {
      setlindisp(true);
      setlock(true);
      if (downeventRef.current) {
        clearInterval(downeventRef.current);
        if (clickedRef.current >= 240) {
          SetString(() => stringRef.current + "-");
          setTemp(() => {
            if (
              morsetotext.hasOwnProperty(texttomorse[tempRef.current] + "-")
            ) {
              return morsetotext[texttomorse[tempRef.current] + "-"];
            } else return mtempref.current + "-";
          });
          setmtemp((prev) => mtempref.current + "-");
        } else {
          SetString((prev) => stringRef.current + ".");
          setTemp((prev) => {
            if (
              morsetotext.hasOwnProperty(texttomorse[tempRef.current] + ".")
            ) {
              return morsetotext[texttomorse[tempRef.current] + "."];
            } else return mtempref.current + ".";
          });
          setmtemp(() => mtempref.current + ".");
        }
        SetClicked(0);
      }

      const up = setInterval(() => {
        if (curmodeRef.current === "keyboard") {
          setUnclicked((prev) => prev + 10);
          settl((prev) => {
            return tlref.current + 10;
          });

          if (unclickedRef.current >= dur) {
            setlindisp(false);
            settl(0);
            clearInterval(up);
            setUpevent(null);
            setUnclicked(0);
            setTemp("");
            setmtemp("");
            SetString("");
            SetmString("");
          }
        } else {
          clearInterval(up);
          setUpevent(null);
          setUnclicked(0);
          setTemp("");
          setmtemp("");
          SetString("");
          SetmString("");
        }
      }, 10);
      setUpevent(up);
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyUp);
    // thankfully the thing ends here

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="w-screen h-screen items-center justify-center bg-black">
      <div className="w-full h-full flex flex-col">
        <div className="w-full min-h-[5%]"></div>
        <div className="w-full flex items-center justify-center mb-auto sm:h-[93%] lg:h-full">
          <div className="w-[25%] h-[100%] mr-auto"></div>
          <div className="w-[50%] h-[100%] mr-auto flex flex-col">
            <div className="min-h-[2px] w-[99%]">
              {lindisp && (
                <motion.div
                  initial={{ opacity: "0%" }}
                  animate={{ opacity: "100%" }}
                  transition={{ duration: "1.5" }}
                  className="h-full w-full flex"
                >
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${(tl / dur) * 100}%` }}
                  ></div>
                </motion.div>
              )}
            </div>
            <div className="text-white  break-words text-sm w-full overflow-y-auto min-h-[10%] p-2  rounded-sm max-h-[20%]">
              {textstr}
            </div>

            <div className="w-full h-full rounded-sm mb-2"></div>

            <div className="text-white overflow-y-auto break-words text-sm w-full min-h-[10%] p-2 mb-2 rounded-sm max-h-[20%]">
              {strii}
            </div>
            <div className="w-full flex items-center justify-center">
              <Click
                setStrii={setStrii}
                SetTextStr={SetTextStr}
                curmode={curmode}
                setCurmode={setCurmode}
                setlindisp={setlindisp}
                settl={settl}
                delbut={delbut}
                setdelbut={setdelbut}
                dur={dur}
              />
              <div className="text-white p-2">wafw</div>
              <div className="text-white p-2" onClick={()=>{setdelbut(true)}}>fwf</div>
            </div>
          </div>

          <div className="border w-[25%] h-[100%] mr-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default Room;
