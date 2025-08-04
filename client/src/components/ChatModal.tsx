import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setMessages, toggleChat } from "../store/slices/chatSlice";
import { X, Send, Users, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages } = useSelector((state: RootState) => state.chat);
  const { participants, socket } = useSelector(
    (state: RootState) => state.poll
  );
  const { userName, userType, userId } = useSelector(
    (state: RootState) => state.auth
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit("chatMessage", {
        message: message.trim(),
        userId,
        userName,
        userType,
      });
      setMessage("");
    }
  };

  const handleRemoveParticipant = (participantId: string) => {
    if (socket && userType === "teacher") {
      socket.emit("removeParticipant", participantId);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed h-svh inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Chat Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 top-[20%] sm:top-[36%] right-0 ml-2 sm:right-16 md:right-20 xl:right-28 h-[600px] sm:h-[500px] w-full sm:w-[27rem] bg-white shadow-[4px_4px_20px_0px_#00000040] rounded-2xl overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-0 border-b bg-white text-black">
              <div className="flex space-x-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("chat")}
                  className={`flex items-center space-x-2 px-4 py-2 border-b-1 bg-white  text-sm font-medium transition-all ${
                    activeTab === "chat"
                      ? "border-b-2 border-[#8F64E1]"
                      : "hover:text-gray-700"
                  }`}
                >
                  <MessageCircle className="hidden sm:inline-block h-4 w-4" />
                  <span>Chat</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("participants")}
                  className={`flex items-center space-x-2 px-4 py-2 border-b-1  text-sm font-medium transition-all bg-white  ${
                    activeTab === "participants"
                      ? "border-b-2 border-[#8F64E1]"
                      : "hover:text-gray-700"
                  }`}
                >
                  <Users className="hidden sm:inline-block h-4 w-4" />
                  <span>Participants</span>
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-purple-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === "chat" ? (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex-1 flex flex-col"
                  >
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-16">
                      <AnimatePresence>
                        {messages.map((msg, index) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex ${
                              msg.userId === userId
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div className="max-w-xs">
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className={`p-3 rounded-xl ${
                                  msg.userId === userId
                                    ? "bg-[#8F64E1] text-white rounded-tr-none"
                                    : "bg-[#3A3A3B] text-white rounded-tl-none"
                                }`}
                              >
                                <p className="text-sm">{msg.message}</p>
                              </motion.div>
                              <p className="text-xs text-gray-500 mt-1 px-2">
                                {msg.userName} •{" "}
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <motion.form
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      onSubmit={handleSendMessage}
                      className="p-4 absolute bottom-0 w-full border-t bg-gray-50"
                    >
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={!message.trim()}
                          className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </motion.form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="participants"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 overflow-y-auto p-4"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm text-gray-600 font-medium border-b pb-2">
                        <span>Name</span>
                        <span>Action</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600 font-medium  pb-2">
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                          Answered
                        </span>
                        <span className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#D1D5DB]" />
                          Not Answered
                        </span>
                      </div>
                      <AnimatePresence>
                        {participants.map((participant, index) => (
                          <motion.div
                            key={participant.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <motion.div
                                animate={{
                                  scale: participant.hasAnswered
                                    ? [1, 1.2, 1]
                                    : 1,
                                  backgroundColor: participant.hasAnswered
                                    ? "#10B981"
                                    : "#D1D5DB",
                                }}
                                transition={{ duration: 0.3 }}
                                className="w-3 h-3 rounded-full"
                              />
                              <span className="font-medium text-gray-900">
                                {participant.name}
                              </span>
                            </div>
                            {userType === "teacher" &&
                              participant.id !== userId && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleRemoveParticipant(participant.id)
                                  }
                                  className="text-blue-500 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-50 transition-colors"
                                >
                                  Kick out
                                </motion.button>
                              )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
