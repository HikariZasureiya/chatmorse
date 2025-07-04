import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useMemo } from "react";
import { TypingAnimation } from "../components/typing";
import { Typing } from "../components/typing1"
import audioon from "../assets/audioon.svg"; // or .svg/.jpg
import muteaudio from "../assets/muteaudio.svg";
import CMatrix from "../components/Cmatrix";
import { motion } from "motion/react";
import { Button } from "../components/HomeButton"

function Home() {
  const totalHeight = document.documentElement.scrollHeight;
  const totalWidth = document.documentElement.scrollWidth;
  const [moved, setMoved] = useState(false);
  const movedRef = useRef(moved);
  const [done, setDone] = useState("#ffffff");
  const doneRef = useRef(done);
  const audioCtxRef = useRef(null);
  const [audioctr, setaudioctr] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [totHeight, setTotHeight] = useState(
    document.documentElement.scrollHeight
  );
  const [totWidth, setTotWidth] = useState(
    document.documentElement.scrollWidth
  );
  const [starttyping, setstarttyping] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const handleResize = () => {
      setTotHeight(document.documentElement.scrollHeight);
      setTotWidth(document.documentElement.scrollWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };

  }, []);

  useEffect(()=>{
    console.log("here", starttyping);
  },[starttyping])

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
    } else if (ctx.state === "running") {
      await ctx.suspend();
      setAudioEnabled((prev) => {
        return !prev;
      });
    }
  };

  return (
    <div className="flex relative flex-col w-screen min-h-screen items-center justify-center bg-black ">
      <motion.div
        className={`absolute top-0 left-0 w-screen h-screen z-50 flex flex-col  bg-black transition-all duration-1000 ease-in-out ${
          moved ? "-translate-y-full opacity-100" : "translate-y-0 opacity-100"
        }`}

        onTransitionEnd={() => {
            setstarttyping(true);
          }}
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
                duration={50}
              >
                {"-- --- .-. ... . / - .- .-.. -.- "}
              </TypingAnimation>
            </div>
          </div>
        </div>
      </motion.div>


      {moved && (
        <CMatrix height={totHeight} width={totWidth} status={moved} zzindex={0}>
          <div className="relative min-h-screen w-full bg-white/1 backdrop-blur-[3px] backdrop-brightness-75">
            <div className="w-full h-auto flex justify-center items-center p-2 lg:text-xl md:text-lg sm:text-sm text-[9px] font-pressstarttwop">
              {starttyping && <Typing duration={50} initcol={"white"} fincol={"green"} className="mt-20">{'-- --- .-. ... . / - .- .-.. -.- '}</Typing>}
            </div>
            <div  className="w-full h-full">
              <div>
                {/* <Button onClick={() => {console.log("yeahh");navigate('/room')}} /> */}
              </div>
            </div>
          </div>
        </CMatrix>
      )}
    </div>
  );
}

export default Home;
