import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleChat } from '../store/slices/chatSlice';
import { Loader2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ChatModal from './ChatModal';
import IntervueHeader from './IntervueHeader';

const StudentWaiting: React.FC = () => {
  const dispatch = useDispatch();
  const { userName } = useSelector((state: RootState) => state.auth);
  const { isOpen } = useSelector((state: RootState) => state.chat);
  const { participants } = useSelector((state: RootState) => state.poll);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15 }}
        >
         <IntervueHeader />
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', damping: 15 }}
          className="mb-8"
        >
          <Loader2 className="h-16 w-16 text-[#500ECE] animate-spin mx-auto mb-6" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-[33px] font-semibold text-black mb-4"
        >
          Wait for the teacher to ask questions..
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-400 mb-8"
        >
          Hello {userName}! You're all set up. The teacher will start asking questions soon.
        </motion.p>

      </motion.div>

      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', damping: 15 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(toggleChat())}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
      >
        <MessageCircle className="h-6 w-6" />
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

export default StudentWaiting;