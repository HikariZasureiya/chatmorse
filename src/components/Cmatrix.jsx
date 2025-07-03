import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "motion/react";

const CmatCompo = ({
  id,
  handleDone,
  compocountRef,
  height,
  width,
  gotime,
  zzindex,
}) => {
  const [moved, setMoved] = useState(false);
  const [text, setText] = useState("");
  const [lock, setLock] = useState(true);
  const [generatetime, setgeneratetime] = useState(100);
  const [fontsize, setfontsize] = useState(16);
  const randx = useMemo(() => {
    return Math.floor(Math.random() * (width - 2 + 1)) + 2;
  }, []);

  useEffect(() => {
    if (height > 750 && width < 640) setgeneratetime(70);
    if (width < 500) setfontsize(14);
  }, [width, height]);

  useEffect(() => {
    const chargen = () => {
      const maxlen = 20;
      const minlen = 10;
      const randlen =
        Math.floor(Math.random() * (maxlen - minlen + 1)) + minlen;
      let stringg = "";
      for (let i = 0; i < randlen; i++) {
        const randascii = Math.floor(Math.random() * (122 - 33 + 1)) + 33;
        stringg += String.fromCharCode(randascii);
      }
      setText(stringg);
    };

    chargen();
    setTimeout(() => setMoved(true), 0);
  }, []);

  useEffect(() => {
    if (text === "") return;
    if (lock) {
      let timee = 0;
      const interval = setInterval(() => {
        setLock(false);
        setText((prev) => {
          const randascii = Math.floor(Math.random() * (122 - 33 + 1)) + 33;
          return prev.slice(1) + String.fromCharCode(randascii);
        });
        timee += 100;

        if (timee > gotime.current * 1000 ) {
          handleDone(id);
          compocountRef.current -= 1;
          clearInterval(interval);
        }
      }, generatetime);
    }
  }, [text, lock]);

  return (
    <motion.div
      initial={{ left: randx, top: -500 }}
      animate={{ top: moved ? height * 1.5 : -500 }}
      transition={{ duration: gotime.current, ease: "linear" }}
      className="absolute w-screen h-screen z-50 flex flex-col select-none"
      style={{zIndex:zzindex}}

    >
      {text
        .split("")
        .slice(0, -1)
        .map((char, index) => (
          <div
            key={index}
            style={{ fontSize: `${fontsize}px` }}
            className="text-green-500"
          >
            {char}
          </div>
        ))}

      <div
        key={text.length}
        style={{ fontSize: `${fontsize}px` }}
        className="text-cyan-50"
      >
        {text.charAt(text.length - 1)}
      </div>
    </motion.div>
  );
};

const CMatrix = ({ height, width, status , zzindex , children }) => {
  const [components, setComponents] = useState([]);
  const intervalStarted = useRef(false);
  const totalcomp = useRef(0);
  const compocount = useRef(0);
  const gotime = useRef(0);
  const spawntime = useRef(0);


  const addComponent = () => {
    const id = crypto.randomUUID();
    setComponents((prev) => [...prev, { id }]);
    compocount.current += 1;
  };

  // Start interval only once
  useEffect(() => {
    if (!status) return;

    if (width > 1024) {
      totalcomp.current = 500;
      gotime.current = (3 / 730) * height;
      spawntime.current = 10;
    } else if (width > 768) {
      totalcomp.current = 200;
      gotime.current = (3 / 730) * height;
      spawntime.current = 30;
    } else if (width > 640) {
      totalcomp.current = 100;
      gotime.current = (3 / 771) * height;
      spawntime.current = 40;
    } else if (width > 500) {
      totalcomp.current = 100;
      gotime.current = (3 / 771) * height;
      spawntime.current = 40;
    } else {
      totalcomp.current = 100;
      gotime.current = (3 / 771) * height;
      spawntime.current = 50;
    }

    if (intervalStarted.current) return;
    intervalStarted.current = true;
    const cmatinterval = setInterval(() => {
      if (compocount.current < totalcomp.current) addComponent();
    }, spawntime.current);
  }, [status, width, height]);

  const handleDone = (id) => {
    setComponents((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full min-h-screen relative">
  {/* matrix rain layer (stays in background) */}
  <div className="w-full absolute inset-0 overflow-hidden z-0">
    {components.map((item) => (
      <CmatCompo
        key={item.id}
        id={item.id}
        handleDone={handleDone}
        compocountRef={compocount}
        height={height}
        width={width}
        gotime={gotime}
        zzindex={zzindex}
      />
    ))}
  </div>

  {/* foreground content that can overflow */}
  <div className="relative z-10">
    {children}
  </div>
</div>
    
    
  );
};

export default CMatrix;
