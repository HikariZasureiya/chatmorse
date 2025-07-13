import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import pointer from "../assets/pointer.svg";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
export default function Pubpage() {
  const [roomid, setroomid] = useState("");
  const [roomarr, setroomarr] = useState([]);
  const navigate = useNavigate();
  const [color , setcolor] = useState("border-green-400")
  const host = import.meta.env.VITE_HOST;

  const addtochat = (data) => {
    setroomarr((prev) => [...prev, data]);
  };

  const joinRoom = (roomid) => {
    const data = { code: roomid };
    navigate("/room", { state: data });
  };

  const roomhas = async (roomid , setcolor) => {
      try {
        const response = await fetch(`${host}/roomhas/${roomid}`);
        if (!response.ok) {
          setcolor("border-red-600")
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        joinRoom(roomid)
      } catch (err) {
        console.error("room doesn't exist:", err);
      }
    };
  

  useEffect(() => {
    const getrooms = async () => {
      try {
        const response = await fetch(`${host}/getrooms`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.forEach((room) => {
          const roomjson = { roomid: room.roomid, nousers: room.number };
          addtochat(roomjson);
        });
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };
    getrooms();
  }, []);

  return (
    <div className="w-screen h-screen bg-black">
      <div className="flex flex-col h-full w-full">
        <div className="bg-gray-950 w-full h-[6%]"></div>
        <div className="mb-auto mt-10 flex flex-col items-center justify-center">
          <div className="w-full text-white text-center lg:text-[23px] md:text-[20px] sm:text-[15px] text-[15px] mb-5 font-pressstarttwop select-none">
            Join with a code
          </div>
          <div className="w-full flex items-center justify-center">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={roomid}
              onChange={setroomid}
              inputMode="text"
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className={`font-pressstarttwop text-green-400 border ${color} lg:h-12 md:h-10 sm:h-7 h-7 lg:w-12 md:w-10 sm:w-7 w-7 lg:text-[20px] md:text-[18px] sm:text-[12px] text-[12px]`}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <div
              onClick={() => {
                if (roomid.length < 6) setroomid("");
                else {
                  roomhas(roomid  ,setcolor);
                  setroomid("");
                }
              }}
              className="cursor-pointer hover:scale-110 active:scale-90"
            >
              <img
                src={pointer}
                className="lg:w-12 md:w-11 sm:w-10 w-9  ml-5"
              />
            </div>
          </div>
          <div className="w-full h-full flex justify-center">
            <div className="rounded-lg flex flex-col items-center justify-center font-bold lg:w-[60%] md:w-[70%] sm:w-[60%] w-[60%] mt-5 text-white">
              <h2 className="text-xl text-center text-green-400 mb-2">
                Active Public Rooms
              </h2>
              <div className="lg:w-[60%] md:w-[80%] min-w-[250px] max-w-[60%] max-h-[450px] flex flex-col border p-2 border-green-500 mt-2 overflow-y-auto rounded-md scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent">
                {roomarr.length === 0 ? (
                  <div className="text-gray-400 text-sm text-center py-4">
                    No rooms found.
                  </div>
                ) : (
                  roomarr.map((room, index) => (
                    <div
                      key={room.roomid + index}
                      className="p-3 border-b border-green-700 flex justify-between items-center"
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-green-300 text-sm truncate">
                          #{room.roomid}
                        </span>
                        <span className="text-xs text-gray-400">
                          {room.nousers} user{room.nousers !== 1 && "s"}
                        </span>
                      </div>
                      <button
                        onClick={() => joinRoom(room.roomid)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                      >
                        Join
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
