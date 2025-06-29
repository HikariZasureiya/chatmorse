import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function TypingAnimation({
  setMoved,
  setDone,
  children,
  className,
  duration = 70,
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

    const interval = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.slice(0, i + 1));
        i++;
      } else {
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
      }
    }, duration);

    return () => clearInterval(interval);
  }, [started, children, duration, setMoved, setDone]);

  return (
    <MotionComponent
      ref={elementRef}
      className={`text-3xl font-bold leading-[5rem] tracking-[-0.02em] ${className || ""}`}
      initial={{ color: initialColor }}
      animate={{ color: finalColor }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <h1>{displayedText}</h1>
    </MotionComponent>
  );
}
