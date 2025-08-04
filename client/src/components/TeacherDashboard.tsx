import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { Plus, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import PollHistoryView from "./PollHistoryView";
import IntervueHeader from "./IntervueHeader";
import { addPoll, Poll } from "../store/slices/pollSlice";

interface PollOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

const TeacherDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<PollOption[]>([
    { id: "1", text: "", isCorrect: false },
    { id: "2", text: "", isCorrect: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLimit, setTimeLimit] = useState(60);
  const [showHistory, setShowHistory] = useState(false);

  const { socket, participants } = useSelector(
    (state: RootState) => state.poll
  );
  // const { isOpen } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (!socket) return;

    const handleNewPoll = (poll: Poll) => {
      dispatch(addPoll(poll));
      // Optionally show success message
    };

    socket.on("newPoll", handleNewPoll);

    return () => {
      socket.off("newPoll", handleNewPoll);
    };
  }, [socket, dispatch]);

  if (showHistory) {
    return <PollHistoryView onBack={() => setShowHistory(false)} />;
  }

  const addOption = () => {
    const newOption: PollOption = {
      id: Date.now().toString(),
      text: "",
      isCorrect: false,
    };
    setOptions([...options, newOption]);
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map((opt) => (opt.id === id ? { ...opt, text } : opt)));
  };

  const toggleCorrect = (id: string, correct: boolean = true) => {
    setOptions(
      options.map((opt) =>
        opt.id === id
          ? { ...opt, isCorrect: correct }
          : { ...opt, isCorrect: false }
      )
    );
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter((opt) => opt.id !== id));
    }
  };

  const handleSubmitQuestion = () => {
    setError(null);

    if (!question.trim() || !options.every((opt) => opt.text.trim())) {
      setError("Please fill in all fields");
      return;
    }

    if (!options.some((opt) => opt.isCorrect)) {
      setError("Please mark at least one correct answer");
      return;
    }

    if (!socket) {
      setError("Connection error. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);

    const pollData = {
      question: question.trim(),
      options: options.map((opt) => ({
        ...opt,
        text: opt.text.trim(),
        votes: 0, // Initialize votes
      })),
      timeLimit,
    };

    socket.emit(
      "createPoll",
      pollData,
      (response: { success: boolean; error?: string }) => {
        setIsSubmitting(false);
        if (response.success) {
          // Reset form on success
          setQuestion("");
          setOptions([
            { id: "1", text: "", isCorrect: false },
            { id: "2", text: "", isCorrect: false },
          ]);
        } else {
          setError(response.error || "Failed to create poll");
        }
      }
    );
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="w-full border-b border-[#B6B6B6] p-4">
        <div className="sm:max-w-4xl m-2 sm:m-10 md:ml-36 md:mt-[3.8rem]">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col w-full justify-between items-start mb-6"
          >
            <IntervueHeader />
            <h1 className="text-[40px] leading-[100%] font-bold text-gray-900 mb-2 sora-font">
              Let's{" "}
              <span className="text-black font-semibold">Get Started</span>
            </h1>
            <p className="text-[#00000080] text-[17px] tracking-wide sora-font mt-2 max-w-3xl">
              You'll have the ability to create and manage polls, ask questions,
              and monitor your students' responses in real-time.
            </p>

            {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHistory(true)}
            className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full hover:bg-purple-200 transition-colors"
          >
            View History
          </motion.button> */}
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white pl-0 p-8"
          >
            {/* Question Input */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-lg !font-semibold text-black sora-font leading-[100%]">
                  Enter your question
                </label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <select
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="bg-gray-100 border-0 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={15}>15 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={45}>45 seconds</option>
                    <option value={60}>60 seconds</option>
                  </select>
                </div>
              </div>
              <textarea
                value={question}
                autoFocus
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full h-32 px-4 py-4 bg-gray-100 border-0 rounded-xl resize-none focus:ring-0 outline-none transition-all"
                placeholder="Type your question here..."
                maxLength={200}
              />
              <div className="text-right text-sm text-gray-500 mt-2">
                {question.length}/200
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Options */}
              <div>
                <h3 className="text-base !font-semibold text-black sora-font leading-[100%] mb-4">
                  Edit Options
                </h3>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center flex-wrap space-x-3"
                    >
                      <div  className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6  bg-[linear-gradient(90deg,_#7565D9_0%,_#4D0ACD_100%)] text-white rounded-full flex items-center justify-center text-[11px] leading-[100%] sora-font !font-semibold">
                        {index + 1}
                      </div>
                      <input
                        value={option.text}
                        onChange={(e) =>
                          updateOption(option.id, e.target.value)
                        }
                        className="flex-1 px-3 py-3 bg-gray-100 border-0 rounded-[3px] focus:ring-2 focus:ring-purple-500"
                        placeholder={`Option ${index + 1}`}
                        maxLength={100}
                      />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeOption(option.id)}
                        className={`text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50`}
                        style={{
                          visibility: options.length > 2 ? "visible" : "hidden",
                        }}
                      >
                        Remove
                      </motion.button>
                    </motion.div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addOption}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 text-sm font-medium hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add More option</span>
                  </motion.button>
                </div>
              </div>

              {/* Correct Answer */}
              <div>
                <h3 className="text-base !font-semibold text-black sora-font leading-[100%] mb-4">
                  Is it Correct?
                </h3>
                <div className="space-y-3">
                  {options.map((option) => (
                    <div key={option.id} className="flex space-x-6 py-3">
                      {/* Yes Option */}
                      <label className="flex items-center cursor-pointer space-x-2">
                        <input
                          type="radio"
                          name={`correct-${option.id}`}
                          className="sr-only"
                          checked={option.isCorrect === true}
                          onChange={() => toggleCorrect(option.id, true)}
                        />
                        <div
                          className={`w-5 h-5 rounded-full  flex items-center justify-center transition-all duration-200
                       ${
                         option.isCorrect === true
                           ? "border-[#8F64E1] border-2"
                           : "border-gray-300 border-8"
                       }
                     `}
                        >
                          <div
                            className={`w-3 h-3 rounded-full
                         ${
                           option.isCorrect === true
                             ? "bg-[#8F64E1]"
                             : "bg-gray-300"
                         }
                       `}
                          ></div>
                        </div>
                        <span className="font-medium text-black">Yes</span>
                      </label>

                      {/* No Option */}
                      <label className="flex items-center cursor-pointer space-x-2">
                        <input
                          type="radio"
                          name={`correct-${option.id}`}
                          className="sr-only"
                          checked={option.isCorrect === false}
                          onChange={() => toggleCorrect(option.id, false)}
                        />
                        <div
                          className={`w-5 h-5  rounded-full flex items-center justify-center transition-all duration-200
                       ${
                         option.isCorrect === false
                           ? "border-[#8F64E1] border-2"
                           : "border-gray-300 border-4"
                       }
                     `}
                        >
                          <div
                            className={`w-3 h-3 rounded-full
                         ${
                           option.isCorrect === false
                             ? "bg-[#8F64E1]"
                             : "bg-gray-300"
                         }
                       `}
                          ></div>
                        </div>
                        <span className="font-medium text-black">No</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span className="text-sm">
                  {participants.length} participants connected
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chat Button */}
      {/* <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(toggleChat())}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-30"
      >
        <MessageCircle className="h-6 w-6" />
        {participants.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {participants.length}
          </span>
        )}
      </motion.button> */}

      {/* Chat Panel */}
      {/* <ChatPanel isOpen={isOpen} onClose={() => dispatch(toggleChat())} /> */}
      <div className="flex justify-end p-3 md:mx-14">
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmitQuestion}
          disabled={
            !question.trim() ||
            !options.every((opt) => opt.text.trim()) ||
            !options.some((opt) => opt.isCorrect)
          }
          className="px-8 py-3 rounded-full font-medium bg-[linear-gradient(99.18deg,_#8F64E1_-46.89%,_#1D68BD_223.45%)] text-white hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </span>
          ) : (
            "Ask Question"
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
