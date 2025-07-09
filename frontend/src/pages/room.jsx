import { useState, useRef, useEffect } from "react";
import Click from "../components/Transmitter";
import morsetotext from "../assets/morsetotext.json";
import texttomorse from "../assets/texttomorse.json";
import deletebin from "../assets/deletebin.svg";
import sendicon from "../assets/send.svg";
import { motion } from "motion/react";
import CMatrix from "@/components/Cmatrix";
import { Typing } from "../components/typing1";

const Switcher = ({ setmatrixon, matrixon }) => {
  const handleCheckboxChange = () => {
    setmatrixon(!matrixon);
  };

  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          checked={matrixon}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div className={`block h-6 w-12 rounded-full ${matrixon ? "bg-green-400" : "bg-gray-500"}`}></div>
        <div
          className={`dot absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition 
            ${matrixon ? "translate-x-6" : "translate-x-0"}`}
        ></div>
      </div>
    </label>
  );
};

function Room() {
  const divRef = useRef(null);
  const [hei, setheight] = useState(0);
  const [wid, setwidth] = useState(0);
  const [chatarr, setchatarr] = useState([]);
  const [matrixon , setmatrixon] = useState(true);
  // Don't even dare touch this. it just works
  const dur = 3000;
  const keyset = ["Period", "Space", "KeyZ"];
  const [strii, setStrii] = useState("");
  const [textstr, SetTextStr] = useState("");
  const [curmode, setCurmode] = useState("");
  const curmodeRef = useRef(curmode);
  const [tl, settl] = useState(0);
  const tlref = useRef(tl);
  const [lindisp, setlindisp] = useState(false);
  const lindispref = useRef(lindisp);
  const [delbut, setdelbut] = useState(false);
  const [sndbut, setsndbut] = useState(false);
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
  const striiRef = useRef(strii);
  const textstrRef = useRef(lock);

  const addtochat = (val1, val2) => {
    setchatarr((prev) => [...prev, { morse: val1, text: val2 }]);
  };

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        const { width, height } = divRef.current.getBoundingClientRect();
        setwidth(width);
        setheight(height);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("this", chatarr);
  }, [chatarr]);

  useEffect(() => {
    if (delbut === true) {
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
  }, [delbut]);

  useEffect(() => {
    if (sndbut === true) {
      if(textstr.trim()!== '')
        addtochat(strii, textstr);
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
      setsndbut(false);
      setdelbut(false);
      setlindisp(false);
    }
  }, [sndbut]);

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
    striiRef.current = strii;
  }, [strii]);

  useEffect(() => {
    textstrRef.current = textstr;
  }, [textstr]);

  useEffect(() => {
    console.log(matrixon)
  }, [matrixon]);
  

  useEffect(() => {
    SetTextStr(() => {
      if (morsetotext.hasOwnProperty(temp)) return mstring + morsetotext[temp];
      else if (texttomorse.hasOwnProperty(temp)) return mstring + temp;
      else return mstring;
    });
  }, [mstring, temp]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!keyset.includes(event.code)) return;
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
          SetString(() => stringRef.current + " / ");
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
      if (!keyset.includes(event.code)) return;
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
            if((mstringRef.current + tempRef.current).trim() !== '')
              addtochat(stringRef.current, mstringRef.current + tempRef.current);
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
      <div className="w-full h-full flex flex-col  bg-black">
        <div className="w-full min-h-[7%]"></div>
        <div className="bg-black w-full h-full">
          <div className="w-full flex items-center justify-center mb-auto sm:h-[93%] max-h-[93%]">
            <div className="w-[20%] h-[100%] mr-auto bg-gray-950 rounded-2xl">
              {/* leftbar */}
                <div className="w-full p-3 py-5 flex items-center justify-center">
                    <div className="text-white py-2 px-5 ml-auto  bg-red-600 rounded-lg">Connected</div>
                    <div className="ml-auto">
                      <Switcher setmatrixon={setmatrixon} matrixon={matrixon} />
                    </div>
                </div>
            </div>
            <div className="w-[60%] h-[100%] mr-auto flex flex-col items-center justify-center p-2 ">
              <div className="min-h-[2px] w-[99%]">
                {lindisp && (
                  <motion.div
                    initial={{ opacity: "0%" }}
                    animate={{ opacity: "100%" }}
                    transition={{ duration: "1.5" }}
                    className="h-full w-full flex"
                  >
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(tl / dur) * 100}%` }}
                    ></div>
                  </motion.div>
                )}
              </div>
              <div className="text-white  break-words text-sm w-full overflow-y-auto min-h-[10%] p-2  rounded-sm max-h-[20%] bg-gray-950 mb-2">
                {textstr}
              </div>

              <div
                ref={divRef}
                className="w-full h-full max-h-full max-w-full rounded-sm mb-2 relative"
              >
                <CMatrix height={hei} width={wid} status={matrixon} zzindex={0}>
                  <div
                    className="relative  bg-white/1 backdrop-blur-[3px] backdrop-brightness-75"
                    style={{
                      width: `${wid}px`,
                      height: `${hei}px`,
                    }}
                  >
                    <div className="w-full text-white h-full overflow-y-auto p-2">
                      {chatarr.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-2xl w-auto h-auto max-w-[55%] bg-gray-800 mb-4 break-words"
                        >
                          <div>username</div>
                          <div className="mt-2 break-words">
                           <Typing duration={35}
                              ftsizelg = "lg:text-[3px]"
                              ftsizemd = "md:text-[3px]"
                              ftsizesm = "sm:text-[3px]"
                              ftsize = "text-[2px]"
                           >{item.morse+" "}
                           </Typing>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CMatrix>
              </div>

              <div className="text-white overflow-y-auto break-words text-sm w-full min-h-[10%] p-2 mb-2 rounded-sm max-h-[20%] bg-gray-950">
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
                  addtochat={addtochat}
                  sndbut={sndbut}
                  dur={dur}
                  textstr={textstrRef}
                  strii={striiRef}
                />

                <div className="text-white p-2 ml-5">
                  <img
                    onClick={() => {
                      setdelbut(true);
                    }}
                    className="w-10 hover:scale-110 cursor-pointer active:scale-95"
                    src={deletebin}
                    alt={"deletebin"}
                  ></img>
                </div>

                <div className="text-white p-2 ml-3 mr-1">
                  <img
                    onClick={() => {
                      setsndbut(true);
                    }}
                    className="w-10 hover:scale-110 cursor-pointer active:scale-95"
                    src={sendicon}
                    alt={"sendicon"}
                  ></img>
                </div>
              </div>
            </div>
            <div className="bg-gray-950 w-[20%] h-[100%] mr-auto rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;
