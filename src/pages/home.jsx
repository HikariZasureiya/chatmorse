import { useState, useRef, useEffect } from "react";
import Click from "../components/Transmitter";
import morsetotext from "../assets/morsetotext.json";
import texttomorse from "../assets/texttomorse.json";
import { TypingAnimation } from "../components/typing";
import audioon from "../assets/audioon.svg"; // or .svg/.jpg
import muteaudio from "../assets/muteaudio.svg";

function Room() {
  const display = useRef();
  const [strii, setStrii] = useState("");
  const [textstr, SetTextStr] = useState("");

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
  const [moved, setMoved] = useState(false);
  const [done, setDone] = useState("#ffffff");
  const doneRef = useRef(done);
  const audioCtxRef = useRef(null);
  const [audioctr, setaudioctr] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const handleStartAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    ctx.resume();
    setAudioEnabled(true);
    setaudioctr(1);
  };

  const audiotoggle = async () => {
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      await ctx.resume();
      setAudioEnabled((prev) => {
        return !prev;
      });
      console.log("Audio resumed");
    } else if (ctx.state === "running") {
      await ctx.suspend();
      setAudioEnabled((prev) => {
        return !prev;
      });
      console.log("Audio suspended");
    }
  };

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
    SetTextStr(() => {
      if (morsetotext.hasOwnProperty(temp)) return mstring + morsetotext[temp];
      else if (texttomorse.hasOwnProperty(temp)) return mstring + temp;
      else return mstring;
    });
  }, [mstring, temp]);

  useEffect(() => {
    const handleKeyPress = (event) => {
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

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyUp);
    // thankfully the thing ends here

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="flex relative flex-col w-screen h-screen items-center justify-center">
      <div
        className={`absolute top-0 left-0 w-screen h-screen z-50 flex flex-col  bg-black transition-all duration-1000 ease-in-out ${
          moved ? "-translate-y-full opacity-100" : "translate-y-0 opacity-100"
        }`}
      >
        <div className=" p-5 flex w-full lg:h-20 md:h-18 sm:h-15 h-14 items-center justify-center">
          <img
            onClick={() => {
              if (audioctr == 0) handleStartAudio();
              else audiotoggle();
            }}
            src={audioEnabled ? audioon : muteaudio}
            alt={audioEnabled ? "Sound On" : "Sound Off"}
            className="lg:w-12 md:w-10 sm:w-8 w-8 lg:h-12 md:h-10 sm:h-8 h-8 ml-auto lg:mr-15 md:mr-15 sm:mr-10 mr-5"
          />
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full flex justify-center items-center">
            <div className="flex text-center items-center justify-center font-bold lg:w-full md:w-[70%] sm:w-[60%] w-[60%]">
              <TypingAnimation
                setMoved={setMoved}
                setDone={setDone}
                doneRef={doneRef}
                done={done}
                audioCtxRef={audioCtxRef}
                duration={60}
              >
                { "-- --- .-. ... . / - .- .-.. -.- " }
              </TypingAnimation>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Click setStrii={setStrii} SetTextStr={SetTextStr} />
        <div ref={display} style={{ marginBottom: "20px", marginTop: "10px" }}>
          Morse: {strii}
        </div>
        <div>Text: {textstr}</div>
      </div>
    </div>
  );
}

export default Room;
