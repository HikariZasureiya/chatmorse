import { useState, useRef, useEffect } from "react";
import morsetotext from "../assets/morsetotext.json";
import texttomorse from "../assets/texttomorse.json";

export default function ({
  setStrii,
  SetTextStr,
  curmode,
  setCurmode,
  settl,
  setlindisp,
  dur,
  delbut,
  setdelbut,
}) {
  const [ismobile, setIsMobile] = useState(false);
  const [clicked, SetClicked] = useState(0);
  const [unclicked, setUnclicked] = useState(0);
  const [string, SetString] = useState("");
  const [mstring, SetmString] = useState("");
  const [downevent, setDownevent] = useState(null);
  const [upevent, setUpevent] = useState(null);
  const [temp, setTemp] = useState("");
  const [mtemp, setmtemp] = useState("");
  const clickedRef = useRef(clicked);
  const unclickedRef = useRef(unclicked);
  const mtempref = useRef(mtemp);
  const curmodeRef = useRef(curmode);

  useEffect(() => {
    if (delbut === true) {
      clearInterval(upevent);
      clearInterval(downevent);
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
    const checkIfMobile =
      /Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry|IEMobile/i.test(
        navigator.userAgent
      );
    setIsMobile(checkIfMobile);
  }, []);

  // store the mousedown time in a reference using useEffect to avoid bugs ;(
  useEffect(() => {
    clickedRef.current = clicked;
  }, [clicked]);

  // same as above but for unclicked
  useEffect(() => {
    unclickedRef.current = unclicked;
  }, [unclicked]);

  //   useEffect(() => {
  //     tempref.current = temp;
  //   }, [temp]);

  // update Strii as needed
  useEffect(() => {
    setStrii(string);
  }, [string]);

  useEffect(() => {
    mtempref.current = mtemp;
  }, [mtemp]);

  useEffect(() => {
    curmodeRef.current = curmode;
  }, [curmode]);

  useEffect(() => {
    SetTextStr((prev) => {
      if (morsetotext.hasOwnProperty(temp)) return mstring + morsetotext[temp];
      else if (texttomorse.hasOwnProperty(temp)) return mstring + temp;
      else return mstring;
    });
  }, [mstring, temp]);

  // typein checks for unclicked value to seperate letters annd words
  const typein = () => {
    settl(0);
    setlindisp(false);
    setCurmode("mouse");
    if (upevent) {
      clearInterval(upevent);
      setUpevent(null);
    }
    if (unclickedRef.current >= 560) {
      SetString((prev) => prev + "/");
      SetmString((prev) => {
        if (texttomorse.hasOwnProperty(temp)) return prev + temp + " ";
        else if (morsetotext.hasOwnProperty(temp))
          return prev + morsetotext[temp] + " ";
        else return prev + " ";
      });
      setTemp("");
      setmtemp("");
    } else if (unclickedRef.current >= 240) {
      SetString((prev) => prev + " ");
      SetmString((prev) => {
        if (texttomorse.hasOwnProperty(temp)) return prev + temp;
        else if (morsetotext.hasOwnProperty(temp))
          return prev + morsetotext[temp];
        else return prev;
      });
      setTemp("");
      setmtemp("");
    }
    setUnclicked(0);

    // set interval to check for clickdown time spent
    const down = setInterval(() => {
      SetClicked((prev) => prev + 10);
    }, 10);
    setDownevent(down);
  };

  // works same as typein but adds the main dits and dahs to the string
  const typeout = () => {
    setlindisp(true);
    setCurmode("mouse");
    if (downevent) {
      clearInterval(downevent);
      if (clickedRef.current >= 240) {
        SetString((prev) => prev + "-");
        setTemp((prev) => {
          if (morsetotext.hasOwnProperty(texttomorse[prev] + "-")) {
            return morsetotext[texttomorse[prev] + "-"];
          } else return mtempref.current + "-";
        });
        setmtemp((prev) => prev + "-");
      } else {
        SetString((prev) => prev + ".");
        setTemp((prev) => {
          if (morsetotext.hasOwnProperty(texttomorse[prev] + ".")) {
            return morsetotext[texttomorse[prev] + "."];
          } else return mtempref.current + ".";
        });
        setmtemp((prev) => prev + ".");
      }
      SetClicked(0);
    }

    const up = setInterval(() => {
      if (curmodeRef.current === "mouse") {
        settl((prev) => prev + 10);
        setUnclicked((prev) => prev + 10);
        // clears string after 5 seconds of inactivity
        if (unclickedRef.current >= dur) {
          setlindisp(false);
          settl(0);
          clearInterval(up);
          setUpevent(null);
          setUnclicked(0);
          SetString("");
          setTemp("");
          SetmString("");
          setmtemp("");
        }
      } else {
        clearInterval(up);
        setUpevent(null);
        setUnclicked(0);
        SetString("");
        setTemp("");
        SetmString("");
        setmtemp("");
      }
    }, 10);

    setUpevent(up);
  };
  return (
    <div className="mb-3 w-full">
      <div>
        {ismobile ? (
          <button
            style={{
              backgroundColor: "#EE4B2B",
              width: "100px",
              height: "50px",
            }}
            onTouchStart={(e) => {
              typein();
              e.target.style.backgroundColor = "#E97451";
            }}
            onTouchEnd={(e) => {
              typeout();
              e.target.style.backgroundColor = "#EE4B2B";
            }}
          >
            Key
          </button>
        ) : (
          <button
            style={{
              backgroundColor: "#EE4B2B",
              width: "100%",
              height: "60px",
            }}
            onMouseDown={(e) => {
              typein();
              e.target.style.backgroundColor = "#E97451";
            }}
            onMouseUp={(e) => {
              typeout();
              e.target.style.backgroundColor = "#EE4B2B";
            }}
          >
            Key
          </button>
        )}
      </div>
    </div>
  );
}
