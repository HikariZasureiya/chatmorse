import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Click from "../components/Transmitter";
import morsetotext from "../assets/morsetotext.json";
import texttomorse from "../assets/texttomorse.json";
import texttomorsearr from "../assets/texttomorsearr.json";
import deletebin from "../assets/deletebin.svg";
import sendicon from "../assets/send.svg";
import book from "../assets/book.svg"
import { motion } from "motion/react";
import { Typing } from "../components/typing1";
import Typingindic from "../components/Typingindicator";
import { Slider } from "@/components/ui/slider";
import menu from "../assets/menu.svg";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerCSSProvider,
} from "@/components/ui/drawer";

function Room() {
  const divRef = useRef(null);
  const [chatarr, setchatarr] = useState([]);
  const [socketpoint, setsocketpoint] = useState(null);
  const socketpointref = useRef(socketpoint);
  const [usernamestate, setusernamestate] = useState("");
  const usernamestateRef = useRef(usernamestate);
  const [onlinearr, setonlinearr] = useState({});
  const [typingindicator, settypingindicator] = useState(false);
  const navigate = useNavigate();
  const host = import.meta.env.VITE_HOST;
  const ws = import.meta.env.VITE_WS;

  // Don't even dare touch this. it just works
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
  const [wpm, setwpm] = useState(15);
  const wpmRef = useRef(wpm);
  const [dur, setdur] = useState(3000);
  const durRef = useRef(dur);
  const location = useLocation();
  const roomid = location.state?.code;

  const addtochat = async (val1, val2, usernam) => {
    setchatarr((prev) => [
      ...prev,
      { morse: val1, text: val2, username: usernam },
    ]);
  };

  const addtoonline = (username) => {
    setonlinearr((prev) => {
      if (prev[username]) {
        return prev;
      }
      return {
        ...prev,
        [username]: { typing: false },
      };
    });
  };

  const removefromonline = (username) => {
    setonlinearr((prev) => {
      const newUsers = { ...prev };
      delete newUsers[username];
      return newUsers;
    });
  };

  const updateOnlineUser = (username, typing) => {
    // console.log(username , typing)
    setonlinearr((prev) => {
      if (!(username in prev)) return prev;
      return {
        ...prev,
        [username]: {
          ...prev[username],
          typing: typing,
        },
      };
    });
  };
  const sendmessage = (val1, val2, sockett, usernam) => {
    try {
      const data = {
        type: "morsetext",
        morse: val1,
        text: val2,
        username: usernam,
      };
      sockett.send(JSON.stringify(data));
    } catch (error) {
      console.error("couldn't send message");
    }
  };

  const senddata = (data, sockett) => {
    try {
      sockett.send(JSON.stringify(data));
    } catch (error) {
      console.error("couldn't send message");
    }
  };

  const deleteuser = async () => {
    const response = await fetch(`${host}/deluser`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  };

  useEffect(() => {
    let socket = null;
    let username = "";

    if (roomid) {
      const makesocket = async () => {
        try {
          const response = await fetch(`${host}/genuser`);
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          username = data.username;
          setusernamestate(username);
        } catch (error) {
          console.error("Fetch error:", error);
        }

        try {
          socket = new WebSocket(
            `${ws}/ws/morsechatserver/${roomid}`
          );

          socket.onopen = () => {
            setsocketpoint(socket);
            const data = { type: "join", username: username };
            addtoonline(username + "(me)");
            senddata(data, socket);
          };

          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "morsetext") {
              addtochat(data.morse, data.text, data.username);
            } else if (data.type === "join") {
              addtoonline(data.username);
              const dat = { type: "joinret", username: username };
              socket.send(JSON.stringify(dat));
            } else if (data.type === "joinret") {
              addtoonline(data.username);
            } else if (data.type === "leave") {
              removefromonline(data.username);
            } else if (data.type === "istyping") {
              // console.log(data);
              updateOnlineUser(data.username, data.status);
            }
          };

          socket.onerror = (e) => {
            console.error(e);
          };
        } catch (error) {
          console.error("WebSocket error:", error);
        }
      };

      makesocket();
    } else {
      navigate("/");
    }

    const handleBeforeUnload = (e) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const dat = { type: "leave", username };
        try {
          removefromonline(usernamestateRef.current);
          deleteuser();
          socket.send(JSON.stringify(dat));
        } catch (e) {
          console.error("Failed to send on unload", e);
        }
        socket.close();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const dat = { type: "leave", username };
        try {
          removefromonline(usernamestateRef.current);
          socket.send(JSON.stringify(dat));
        } catch (e) {
          console.error("Failed to send on unload", e);
        }
        socket.close();
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
      settypingindicator(false);
    }
  }, [delbut]);

  useEffect(() => {
    if (sndbut === true) {
      if (textstr.trim() !== "") {
        sendmessage(strii, textstr, socketpoint, usernamestate);
        addtochat(strii, textstr, usernamestate);
      }
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
      settypingindicator(false);
    }
  }, [sndbut]);

  useEffect(() => {
    durRef.current = dur;
  }, [dur]);

  useEffect(() => {
    wpmRef.current = wpm;
  }, [wpm]);

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
    usernamestateRef.current = usernamestate;
  }, [usernamestate]);

  useEffect(() => {
    socketpointref.current = socketpoint;
  }, [socketpoint]);

  useEffect(() => {
    SetTextStr(() => {
      if (morsetotext.hasOwnProperty(temp)) return mstring + morsetotext[temp];
      else if (texttomorse.hasOwnProperty(temp)) return mstring + temp;
      else return mstring;
    });
  }, [mstring, temp]);

  useEffect(() => {
    const dat = {
      type: "istyping",
      username: usernamestate,
      status: typingindicator,
    };
    senddata(dat, socketpoint);
  }, [typingindicator]);

  useEffect(() => {
    const el = divRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chatarr]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!keyset.includes(event.code)) return;
      settl(0);
      settypingindicator((prev) => {
        return true;
      });
      setlindisp(false);
      setCurmode("keyboard");
      if (lockRef.current) {
        setlock(false);
        if (upeventRef.current) {
          clearInterval(upeventRef.current);
          setUpevent(null);
        }
        if (unclickedRef.current >= (1200 / wpmRef.current) * 7) {
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
        } else if (unclickedRef.current >= (1200 / wpmRef.current) * 3) {
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
        if (clickedRef.current >= (1200 / wpmRef.current) * 3) {
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

          if (unclickedRef.current >= durRef.current) {
            settypingindicator(false);
            if (textstrRef.current.trim() !== "") {
              console.log(mstringRef.current + tempRef.current);
              addtochat(
                stringRef.current,
                mstringRef.current + tempRef.current,
                usernamestateRef.current
              );

              sendmessage(
                stringRef.current,
                mstringRef.current + tempRef.current,
                socketpointref.current,
                usernamestateRef.current
              );
            }
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
          settypingindicator((prev) => {
            return false;
          });
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
    <div className="w-screen h-screen bg-black overflow-x-hidden">
      <div className="w-full flex text-white lg:hidden p-2 py-2.5 bg-gray-950 items-center justify-center">
        <div className="mr-auto">
        <Drawer direction="left" className="border-none">
          <DrawerTrigger className="appearance-none bg-transparent border-none p-0 m-0 outline-none focus:outline-none hover:bg-transparent active:bg-transparent">
            <img className="w-7 h-7 ml-2" src={menu} alt="menu icon" />
          </DrawerTrigger>
          <DrawerContent className={`bg-black border-black`}>
            <LeftSidebar
              roomid={roomid}
              socketpoint={socketpoint}
              onlinearr={onlinearr}
              wpm={wpm}
              dur={dur}
              setwpm={setwpm}
              setdur={setdur}
              Typingindic={Typingindic}
              widval={"w-full"}
              seen={``}
            />
          </DrawerContent>
        </Drawer>
        </div>

        <div className="ml-auto mr-4 ">
        <Drawer direction="right" className="border-none">
          <DrawerTrigger className="appearance-none bg-transparent border-none p-0 m-0 outline-none focus:outline-none hover:bg-transparent active:bg-transparent">
            <img className="w-8 h-8 ml-2 hover:scale-110 active:scale-95" src={book} alt="menu icon" />
          </DrawerTrigger>
          <DrawerContent className={`bg-gray-950 border-gray-700`}>
            <RightSidebar />
          </DrawerContent>
        </Drawer>
        </div>
      </div>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-full">
            <div className="w-full flex items-center justify-center mb-auto h-full">
              <LeftSidebar
                roomid={roomid}
                socketpoint={socketpoint}
                onlinearr={onlinearr}
                wpm={wpm}
                dur={dur}
                setwpm={setwpm}
                setdur={setdur}
                Typingindic={Typingindic}
              />
              <div className="lg:w-[60%] w-[100%] h-[100%] lg:mr-auto  flex flex-col items-center justify-center p-2">
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <div className="w-full flex flex-col items-center justify-center h-full">
                    <div className="min-h-[2px] w-[100%] mb-auto flex items-center justify-center">
                      {lindisp && (
                        <motion.div
                          initial={{ opacity: "0%" }}
                          animate={{ opacity: "100%" }}
                          transition={{ duration: "1.5" }}
                          className="h-full w-full flex"
                        >
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{
                              width: `${(tl / durRef.current) * 100}%`,
                            }}
                          ></div>
                        </motion.div>
                      )}
                    </div>
                    <div
                      className="text-white text-sm w-full p-4 mt-auto mb-2
                rounded-xl shadow-lg 
                bg-white/10 backdrop-blur-md backdrop-brightness-75
                overflow-y-auto break-words max-h-[100%] custom-scrollbar"
                    >
                      {textstr}
                    </div>

                    <div
                      className="w-full flex-1 overflow-y-auto mb-2 custom-scrollbar"
                      ref={divRef}
                    >
                      <div className="w-full">
                        <div className="w-full text-white">
                          {chatarr.map((item, index) => (
                            <div className="w-full flex">
                              <div
                                key={index}
                                className={`p-3 rounded-2xl w-auto h-auto min-w-[40%] max-w-[55%] mb-4 break-words ${
                                  item.username === usernamestate
                                    ? "  bg-gray-800  font-semibold text-white ml-auto"
                                    : "bg-[#0f172a]  font-semibold"
                                }`}
                              >
                                <div>{item.username}</div>
                                <div className="mt-2 break-words">
                                  <Typing
                                    duration={35}
                                    ftsizelg="lg:text-[3px]"
                                    ftsizemd="md:text-[3px]"
                                    ftsizesm="sm:text-[3px]"
                                    ftsize="text-[2.5px]"
                                  >
                                    {item.morse + " "}
                                  </Typing>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div
                      className="text-white text-sm w-full p-4 mt-auto mb-2
                rounded-xl shadow-lg border border-white/10
                bg-white/10 backdrop-blur-md backdrop-brightness-75
                overflow-y-auto break-words max-h-[100%]"
                    >
                      {strii}
                    </div>
                    <div className="w-full flex items-center justify-center mt-auto">
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
                        usernamestate={usernamestateRef.current}
                        sendmessage={sendmessage}
                        socketpoint={socketpoint}
                        settypingindicator={settypingindicator}
                        wpm={wpm}
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
                </div>
              </div>
              <div className="bg-gray-950 w-[20%] h-[100%] mr-auto lg:block hidden">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;

const RightSidebar = () => {

  return(
    <div className="w-full h-full p-1 flex flex-col">
      <div className="w-full p-2 mt-2 font-pressstarttwop text-white text-center">
        CHEAT SHEET
      </div>
      <div class="grid grid-cols-3 gap-3 overflow-y-auto custom-scrollbar">
        {texttomorsearr.map(({ char, morse }) => (
          <div
            key={char}
            className="p-0.5 text-center rounded bg-gray-800 text-white text-sm flex items-center justify-center"
          >
            <div className="mr-3 ">{`${char}  : `}</div>
            <div>
              <strong className="text-green-500">{morse}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

const LeftSidebar = ({
  roomid,
  socketpoint,
  onlinearr,
  wpm,
  dur,
  setwpm,
  setdur,
  Typingindic,
  widval = "w-[20%]",
  seen = "md:hidden sm:hidden hidden lg:block",
}) => {
  return (
    <div
      className={`${widval} ${seen} h-full mr-auto bg-gray-950 flex flex-col items-center justify-center`}
    >
      <div className="w-full text-center text-white font-pressstarttwop mt-5 text-sm flex items-center justify-center">
        {`ROOM CODE: ${roomid}`}
      </div>
      <div className="w-full py-5 flex items-center justify-center">
        {socketpoint ? (
          <div className="text-white py-2 px-5 bg-green-500 rounded-lg">
            Connected
          </div>
        ) : (
          <div className="text-white py-2 px-5 bg-red-600 rounded-lg">
            Disconnected
          </div>
        )}
      </div>

      <div className="w-full text-green-500 font-pressstarttwop text-sm text-center mt-5">
        Online Users
      </div>
      <div className="w-full mt-5 h-auto lg:h-[40%] max-h-[40%] overflow-y-auto flex p-2 custom-scrollbar">
        <div className="h-full w-full p-1">
          {Object.keys(onlinearr).map((username) => (
            <div
              key={username}
              className="flex w-full mb-3 px-1 font-pressstarttwop text-[10px] text-white items-center justify-center"
            >
              <div className="mr-auto">{username}</div>
              {onlinearr[username]?.typing && (
                <Typingindic
                  className="flex gap-1 ml-auto mr-2"
                  dotclassName="animate-bounce text-green-500"
                  delay={0.2}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full mt-auto mb-10">
        <div className="w-full h-auto p-5">
          <div className="text-white mb-4 font-pressstarttwop text-[12px]">
            {`WPM: ${wpm}`}
          </div>
          <Slider
            defaultValue={[wpm]}
            value={[wpm]}
            onValueChange={(v) => setwpm(v[0])}
            max={50}
            min={5}
            step={1}
            color="green"
            className="mt-4"
          />
        </div>
        <div className="w-full h-auto p-5">
          <div className="text-white mb-4 font-pressstarttwop text-[12px]">
            {`Send delay: ${dur / 1000}sec`}
          </div>
          <Slider
            defaultValue={[dur]}
            value={[dur]}
            onValueChange={(v) => setdur(v[0])}
            max={10000}
            min={2000}
            step={1000}
            color="green"
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
};

// import { use } from "react";

// const Switcher = ({ setmatrixon, matrixon, roomid }) => {
//   const handleCheckboxChange = () => {
//     setmatrixon(!matrixon);
//   };

//   const changeroom = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/ws/changeroom/${roomid}`
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       handleCheckboxChange();
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   };
//   return (
//     <label className="flex cursor-pointer select-none items-center">
//       <div className="relative">
//         <input
//           type="checkbox"
//           checked={matrixon}
//           onChange={changeroom}
//           className="sr-only"
//         />
//         <div
//           className={`block h-6 w-12 rounded-full ${
//             matrixon ? "bg-green-400" : "bg-gray-500"
//           }`}
//         ></div>
//         <div
//           className={`dot absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition
//             ${matrixon ? "translate-x-6" : "translate-x-0"}`}
//         ></div>
//       </div>
//     </label>
//   );
// };
