import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Users } from 'lucide-react';
import axios from 'axios';

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

const PollHistoryView: React.FC<PollHistoryViewProps> = ({ onBack }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPollHistory = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/polls/history');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
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
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  {/* Poll Header */}
                  <div className="bg-gray-800 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-white text-lg font-semibold mb-2 sm:mb-0">
                        Question {pollIndex + 1}
                      </h3>
                      <div className="flex items-center space-x-4 text-gray-300 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{poll.timeLimit}s</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{totalVotes} votes</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="p-6">
                    <div className="bg-gray-800 text-white p-4 rounded-lg mb-6">
                      <h4 className="text-lg font-medium">{poll.question}</h4>
                    </div>

                    {/* Options with Results */}
                    <div className="space-y-3">
                      {poll.options.map((option, index) => {
                        const percentage = getVotePercentage(option.votes, totalVotes);
                        
                        return (
                          <motion.div
                            key={option.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (pollIndex * 0.1) + (index * 0.05) }}
                            className="relative overflow-hidden rounded-xl border-2 border-gray-200"
                          >
                            {/* Progress Bar */}
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: (pollIndex * 0.1) + (index * 0.1) }}
                              className="absolute inset-0 bg-purple-100"
                            />
                            
                            {/* Option Content */}
                            <div className="relative flex items-center justify-between p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                                  {index + 1}
                                </div>
                                <span className="font-medium text-gray-900">{option.text}</span>
                                {option.isCorrect && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                    Correct
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-600">{option.votes} votes</span>
                                <span className="font-bold text-purple-600 text-lg">{percentage}%</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Poll Metadata */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500">
                        <span>Created: {new Date(poll.createdAt).toLocaleString()}</span>
                        {poll.endTime && (
                          <span>Ended: {new Date(poll.endTime).toLocaleString()}</span>
                        )}
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
    </div>
  );
};

export default PollHistoryView;