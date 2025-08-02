import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../store/slices/authSlice";
import { motion } from "framer-motion";
import IntervueHeader from "./IntervueHeader";

const StudentNameEntry: React.FC = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const userId =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      dispatch(
        setUserInfo({ name: name.trim(), id: userId, userType: "student" })
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center flex flex-col justify-between items-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 15 }}
          >
            <IntervueHeader />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[40px] whitespace-nowrap text-gray-900 mb-1 sora-font"
          >
            Let's <span className="text-black font-semibold">Get Started</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-[17px] w-full text-[#00000074] mx-auto sora-font"
          >
            If you're a student, you'll be able to{" "}
            <span className="text-black">submit your answers</span>, participate
            in live polls, and see how your responses compare with your
            classmates
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-normal text-black mb-3"
            >
              Enter your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-4 bg-[#F2F2F2] border-0 rounded-[3px] text-lg focus:ring-0 outline-none transition-all"
              placeholder="Your name here..."
              required
            />
          </div>

          <div className="w-full flex justify-center">
          <button 
            type="submit"
            className="w-fit bg-[linear-gradient(99.18deg,_#8F64E1_-46.89%,_#1D68BD_223.45%)] text-white hover:opacity-90 shadow-lg px-16 py-3 rounded-full text-lg font-semibold transition-all mx-auto"
          >
            Continue
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentNameEntry;
