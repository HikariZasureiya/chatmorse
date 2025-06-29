import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function TypingAnimation({
  setMoved,
  setDone,
  children,
  className,
  duration = 100,
  audioCtxRef,
  delay = 0,
  as: Component = "div",
  startOnView = false,
  ...props
}) {
  const MotionComponent = motion(Component);
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const [finalColor, setFinalColor] = useState("#ffffff");
  const [initialColor, setinitialColor] = useState("#ffffff");
  const colorSet = useRef(false);
  const elementRef = useRef(null);
  

  useEffect(() => {
    if (!startOnView) {
      const timeout = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(timeout);
    }


    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setStarted(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [startOnView, delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    let time = 0;
    let singletime = 0;
    // const audioCtxRef = new AudioContext();

    const interval = setInterval(() => {
      if (i >= children.length) {
        time += duration;
        setDone(true);
        if (!colorSet.current) {
          setFinalColor("#22c55e");
          colorSet.current = true;
        }

        if (time > 1000) {
          setinitialColor("#22c55e");
          setMoved(true);
          clearInterval(interval);
        }
        return;
      }

      const char = children.charAt(i);
      let waitfor = 0;

      if (char === ".") waitfor = duration + 1;
      else if (char === "-") waitfor = duration * 3;
      else if (char === " ") waitfor = duration * 4;

      if (singletime >= waitfor) {
        setDisplayedText((prev) => prev + char);

        if ((char === "." || char === "-") && audioCtxRef.current) {
          const osc = audioCtxRef.current.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, audioCtxRef.current.currentTime);
          osc.connect(audioCtxRef.current.destination);
          osc.start();
          osc.stop(audioCtxRef.current.currentTime + 0.0005 * waitfor);
        }
        i++;
        singletime = 0;
      }

      singletime += duration;
    }, duration);

    return () => {
      clearInterval(interval);
      audioCtxRef.current.close();
    };
  }, [started, children, duration, setMoved, setDone]);
  return (
    <MotionComponent
      ref={elementRef}
      className={`lg:text-[23px] md:text-[15px] sm:text-lg text-[10px] font-bold leading-[5rem] tracking-[-0.02em] ${
        className || ""
      }`}
      initial={{ color: initialColor }}
      animate={{ color: finalColor }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      <h1>{displayedText}</h1>
    </MotionComponent>
  );
}
