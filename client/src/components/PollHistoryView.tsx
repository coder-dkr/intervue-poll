import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Clock, Users } from 'lucide-react';
import axios from 'axios';
import { RootState } from "../store/store";
import { useDispatch, useSelector } from 'react-redux';
import ChatModal from './ChatModal';
import { toggleChat } from '../store/slices/chatSlice';

interface PollOption {
  id: string;
  text: string;
  votes: number;
  isCorrect?: boolean;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  timeLimit: number;
  isActive: boolean;
  createdAt: string;
  endTime?: string;
}

interface PollHistoryViewProps {
  onBack: () => void;
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL

const PollHistoryView: React.FC<PollHistoryViewProps> = ({ onBack }) => {
  const dispatch = useDispatch();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen } = useSelector((state: RootState) => state.chat);
  const { participants } =
  useSelector((state: RootState) => state.poll);

  useEffect(() => {
    const fetchPollHistory = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/polls/history`);
        setPolls(response.data);
      } catch (error) {
        console.error('Failed to fetch poll history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPollHistory();
  }, []);

  const getTotalVotes = (options: PollOption[]) => {
    return options.reduce((sum, option) => sum + option.votes, 0);
  };

  const getVotePercentage = (votes: number, totalVotes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 custom-scroll-container">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium mr-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </motion.button>
          <h1 className="text-3xl font-bold text-gray-900">View Poll History</h1>
        </motion.div>

        {/* Poll History */}
        <div className="space-y-8">
          <AnimatePresence>
            {polls.map((poll, pollIndex) => {
              const totalVotes = getTotalVotes(poll.options);
              
              return (
                <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pollIndex * 0.1 }}
                className="p-6 border-b last:border-b-0"
              >
                  {/* Question */}
                  <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Question {pollIndex + 1}</h4>
                </div>

                <div className='bg-white rounded-lg overflow-hidden'>
                {/* Question Header */}
                <div className="bg-[linear-gradient(90deg,_#343434_0%,_#6E6E6E_100%)] text-white p-4 rounded-t-lg ">
                  <h3 className="text-lg font-semibold">{poll.question}</h3>
                </div>
                {/* Options with Results */}
                <div className="space-y-3 p-5 border-2 border-t-0 rounded-b-lg border-[#6766D5]">
                  {poll.options.map((option, index) => {
                    const percentage = getVotePercentage(option.votes, totalVotes);
                    const isSelected = option.isCorrect;
                    
                    return (
                      <motion.div
                        key={option.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (pollIndex * 0.1) + (index * 0.05) }}
                        className={`relative bg-white overflow-hidden rounded-xl border-2 ${
                          isSelected
                            ? "border-[#6766D5] bg-purple-50"
                            : "border-gray-200"
                        }`}
                      >
                        {/* Progress Bar */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: (pollIndex * 0.1) + (index * 0.1) }}
                          className="absolute inset-0 bg-[#6766D5] overflow-hidden"
                        >
                          <span className="font-medium text-white whitespace-nowrap text-lg z-20 absolute top-1/2 -translate-y-1/2 left-[4.5rem]">
                            {option.text}
                          </span>
                        </motion.div>
                        
                        {/* Option Content */}
                        <div className="relative flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                                isSelected ? "bg-purple-600" : "bg-gray-400"
                              }`}
                            >
                              {index + 1}
                            </motion.div>
                            <span className="font-medium text-gray-900 text-lg z-10 flex-1">
                              {option.text}
                            </span>
                            {isSelected && (
                              <span className="bg-green-100 text-green-800 text-xs px-1 py-1 rounded-full font-medium">
                                <Check size={14} />
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                              {option.votes} votes
                            </span>
                            <span className="font-bold text-purple-600 text-xl">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                </div>

                {/* Poll Metadata */}
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Created: {new Date(poll.createdAt).toLocaleString()}</span>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{poll.timeLimit}s</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{totalVotes} votes</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </AnimatePresence>

          {polls.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">No polls found in history.</p>
            </motion.div>
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

      <style jsx>{`
      /* Hide default scrollbar */
      ::-webkit-scrollbar {
        width: 0;
        background: transparent;
      }

      /* Custom scrollbar container */
      .custom-scroll-container {
        scrollbar-width: thin;
        scrollbar-color: #6766D5 #f1f1f1;
      }

      /* Custom scrollbar for WebKit browsers */
      .custom-scroll-container::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      .custom-scroll-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      .custom-scroll-container::-webkit-scrollbar-thumb {
        background-color: #6766D5;
        border-radius: 10px;
      }

      /* For Firefox */
      @supports (scrollbar-width: thin) {
        .custom-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: #6766D5 #f1f1f1;
        }
      }
    `}</style>
    </div>
  );
};

export default PollHistoryView;