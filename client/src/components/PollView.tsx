import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setCurrentPoll, setUserAnswer } from "../store/slices/pollSlice";
import { toggleChat } from "../store/slices/chatSlice";
import { Clock, Users, MessageCircle, Eye, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatModal from "./ChatModal";
import PollHistoryView from "./PollHistoryView";

// const dummyPoll = {
//   id: "poll-123",
//   question: "Which of these is a frontend JavaScript framework?",
//   isActive: false,
//   options: [
//     {
//       id: "opt-1",
//       text: "Laravel",
//       votes: 3,
//       isCorrect: false,
//     },
//     {
//       id: "opt-2",
//       text: "React",
//       votes: 12,
//       isCorrect: true,
//     },
//     {
//       id: "opt-3",
//       text: "Django",
//       votes: 1,
//       isCorrect: false,
//     },
//     {
//       id: "opt-4",
//       text: "Spring Boot",
//       votes: 4,
//       isCorrect: false,
//     },
//   ],
// };

const PollView: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);

  const { currentPoll, userAnswer, timeRemaining, socket, participants } =
    useSelector((state: RootState) => state.poll);
  const { userType, userId } = useSelector((state: RootState) => state.auth);
  const { isOpen } = useSelector((state: RootState) => state.chat);

  // useEffect(() => {
  //   if (currentPoll && !currentPoll.isActive) {
  //     // Poll has ended, show results
  //     setSelectedOption(null);
  //   }
  // }, [currentPoll]);

  // const currentPoll = dummyPoll;

  const handleOptionSelect = (optionId: string) => {
    if (currentPoll?.isActive && !userAnswer && userType === "student") {
      setSelectedOption(optionId);
      dispatch(setUserAnswer(optionId));

      if (socket) {
        socket.emit("submitAnswer", {
          pollId: currentPoll.id,
          optionId: optionId,
        });
      }
    }
  };

  const handleNewQuestion = () => {
    if (socket && userType === "teacher") {
      // window.location.reload();
      dispatch(setCurrentPoll(null));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTotalVotes = () => {
    return (
      currentPoll?.options.reduce((sum, option) => sum + option.votes, 0) || 0
    );
  };

  const getVotePercentage = (votes: number) => {
    const total = getTotalVotes();
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  if (showHistory) {
    return <PollHistoryView onBack={() => setShowHistory(false)} />;
  }

  if (!currentPoll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F0DCE] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading poll...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {userType === "teacher" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHistory(true)}
              className="absolute right-1/4 top-4 flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>View Poll history</span>
            </motion.button>
          )}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Question {questionNumber}
            </h1>
            <div className="flex items-center space-x-2 text-red-600 font-mono text-lg">
              <Clock className="h-5 w-5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>

          
        </motion.div>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl md:w-[727px] shadow-sm overflow-hidden mb-8"
        >
          {/* Question Header - now with w-full */}
          <div className="bg-[linear-gradient(90deg,_#343434_0%,_#6E6E6E_100%)] text-white p-6 w-full">
            <h2 className="text-xl font-semibold w-full">
              {currentPoll.question}
            </h2>
          </div>

          {/* Options Container - now with w-full */}
          <div className="p-6 space-y-4 w-full border-2 border-t-0 border-[#7765DA] rounded-b-2xl">
            <AnimatePresence>
              {currentPoll.options.map((option, index) => {
                const percentage = getVotePercentage(option.votes);
                const isSelected =
                  selectedOption === option.id || userAnswer === option.id;
                const showResults = !currentPoll.isActive || userAnswer || (userType === 'teacher');

                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all w-full ${
                      isSelected
                        ? "border-[#6766D5] bg-purple-50"
                        : "border-gray-200 hover:border-[#6766D5]"
                    } ${
                      !currentPoll.isActive || userAnswer
                        ? "cursor-default"
                        : ""
                    }`}
                    // onClick={() => handleOptionSelect(option.id)}
                    onClick={() =>  setSelectedOption(option.id)}
                  >
                    {/* Progress Bar - now with w-full */}
                    {showResults && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="absolute inset-0 bg-[#6766D5] overflow-hidden w-full"
                      >
                        <span className="font-medium text-white whitespace-nowrap text-lg z-20 absolute top-1/2 -translate-y-1/2 left-[4.5rem] md:left-[4.5rem]">
                          {option.text}
                        </span>
                      </motion.div>
                    )}

                    {/* Option Content - now with w-full */}
                    <div className="relative flex items-center justify-between p-4 w-full">
                      <div className="flex items-center space-x-4 w-full">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                            isSelected ? "bg-purple-600" : "bg-gray-400"
                          }`}
                        >
                          {index + 1}
                        </motion.div>
                        <span className="font-medium text-gray-900 text-lg z-10 flex-1">
                          {option.text}
                        </span>
                        {!currentPoll.isActive && option.isCorrect && (
                          <span className="bg-green-100 text-green-800 text-xs px-1 py-1 rounded-full font-medium">
                            <Check />
                          </span>
                        )}
                      </div>

                      {showResults && (
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600 hidden md:inline-block whitespace-nowrap">
                            {option.votes} votes
                          </span>
                          <span className="font-bold text-purple-600 text-xl">
                            {percentage}%
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className={`flex ${userType === "student" ? (currentPoll.isActive ? "justify-end" : "justify-center") : "justify-end"}`}>
        {userType === "student" && currentPoll.isActive && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={selectedOption === null}
                  onClick={() => selectedOption !== null && handleOptionSelect(selectedOption)}
                  className="flex items-center px-20  bg-[linear-gradient(99.18deg,_#8F64E1_-46.89%,_#1D68BD_223.45%)] hover:opacity-90  text-white py-3 rounded-full transition-colors mx-auto"
                >
                  <span>Submit</span>
                </motion.button>
              )}
          {!currentPoll.isActive ? (
            <div className="text-center">
              {userType === "student" && <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg text-gray-600 mb-6"
              >
                Wait for the teacher to ask a new question..
              </motion.p>}

              {userType === "teacher" && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNewQuestion}
                  className="flex items-center space-x-2  bg-[linear-gradient(99.18deg,_#8F64E1_-46.89%,_#1D68BD_223.45%)] hover:opacity-90  text-white px-6 py-3 rounded-full transition-colors mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  <span>Ask a new question</span>
                </motion.button>
              )}
            </div>
          ) : (
            userAnswer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-100 text-green-800 px-6 py-3 rounded-full font-medium"
              >
                ✓ Your answer has been submitted
              </motion.div>
            )
          )}
        </div>
      </div>

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(toggleChat())}
        className="fixed bottom-12 right-4 sm:right-16 bg-[#5767D0] text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-colors z-30"
      >
        <img src="/chaticon.svg" alt="chat icon" className="w-6 h-6" />
        {participants.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {participants.length}
          </span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <ChatModal isOpen={isOpen} onClose={() => dispatch(toggleChat())} />
    </div>
  );
};

export default PollView;
