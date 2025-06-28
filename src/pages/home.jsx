import { useState, useRef, useEffect } from "react";
import Click from "../components/Transmitter";
import "../App.css";
import morsetotext from "../assets/morsetotext.json";
import texttomorse from "../assets/texttomorse.json";

function Room() {
  const display = useRef();
  const [strii, setStrii] = useState("");
  const [textstr, SetTextStr] = useState("");
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
  const [lock , setlock] = useState(true);
  const lockRef = useRef(lock);  

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
    setStrii(string);
    stringRef.current = string;
  }, [string]);

  useEffect(() => {
    mstringRef.current = mstring;
  }, [mstring]);

  useEffect(() => {
    SetTextStr(() => {
      if (morsetotext.hasOwnProperty(temp)) return mstring + morsetotext[temp];
      else if (texttomorse.hasOwnProperty(temp)) return mstring + temp;
      else return mstring;
    });
  }, [mstring, temp]);


  useEffect(() => {
    const handleKeyPress = (event) =>{
        if(lockRef.current){
            setlock(false);
            if (upeventRef.current) {
                clearInterval(upeventRef.current);
                setUpevent(null);
            }

            if (unclickedRef.current >= 560) {
                SetString(() => stringRef.current + "/");
                SetmString(() => {
                if (texttomorse.hasOwnProperty(tempRef.current)) 
                    return mstringRef.current + tempRef.current + " ";
                else if (morsetotext.hasOwnProperty(tempRef.current))
                    return mstringRef.current + morsetotext[tempRef.current] + " ";
                else return mstringRef.current + " ";
                });
                setTemp("");
                setmtemp("");
            }
            
            else if (unclickedRef.current >= 240) {
                SetString(() => stringRef.current + " ");
                SetmString(() => {
                if (texttomorse.hasOwnProperty(tempRef.current)) return mstringRef.current + tempRef.current;
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
      setlock(true);
      if (downeventRef.current) {
        clearInterval(downeventRef.current);
        if (clickedRef.current >= 240) {
          SetString((prev) => stringRef.current + "-");
          setTemp((prev) => {
            if (morsetotext.hasOwnProperty(texttomorse[tempRef.current] + "-")) {
              return morsetotext[texttomorse[tempRef.current] + "-"];
            } else return mtempref.current + "-";
          });
          setmtemp((prev) => mtempref.current + "-");
        } else {
          SetString((prev) => stringRef.current + ".");
          setTemp((prev) => {
            if (morsetotext.hasOwnProperty(texttomorse[tempRef.current] + ".")) {
              return morsetotext[texttomorse[tempRef.current] + "."];
            } else return mtempref.current + ".";
          });
          setmtemp(() => mtempref.current + ".");
        }
        SetClicked(0);
      }
      const up = setInterval(() => {
        setUnclicked((prev) => prev + 10);

        // clears string after 3 seconds of inactivity
        if (unclickedRef.current >= 3000) {
          clearInterval(up);
          setUpevent(null);
          setUnclicked(0);
          SetClicked(0);
          SetString("");
          setTemp("");
          SetmString("");
          setmtemp("");
        }
      }, 10);
      setUpevent(up);
    };

    window.addEventListener("keypress", handleKeyPress);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="flex">
      <Click setStrii={setStrii} SetTextStr={SetTextStr} />
      <div ref={display} style={{ marginBottom: "20px", marginTop: "10px" }}>
        Morse: {strii}
      </div>
      <div>Text: {textstr}</div>
    </div>
  );
}

export default Room;
