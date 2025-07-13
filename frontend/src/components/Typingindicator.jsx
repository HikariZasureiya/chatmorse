import { cn } from "@/lib/utils";
import { useEffect } from "react";



const Dots = ({ dotclassName, delay = 0 }) => {
  return (
    <div
      className={cn("select-none", dotclassName)}
      style={{ animationDelay: `${delay}s` }}
    >
        .
    </div>
  );
};

const Typingindic = ({ className, dotclassName , delay }) => {

  return (
    <div className={cn("min-w-5 min-h-2 rounded-full ", className)}>
        <Dots dotclassName={dotclassName} selay={delay}/>
        <Dots dotclassName={dotclassName} delay={2*delay}/>
        <Dots dotclassName={dotclassName} delay={3*delay}/>
    </div>
  );
};

export default Typingindic;
