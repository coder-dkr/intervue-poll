import React from 'react';
import { motion } from 'framer-motion';
import IntervueHeader from './IntervueHeader';

const KickedOutScreen: React.FC = () => {

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15 }}
        >
          <IntervueHeader />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-[40px] font-normal leading-[100%] text-black mb-4 sora-font whitespace-nowrap"
        >
          You've been Kicked out !
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-lg text-[#00000078] mb-8 sora-font max-w-2xl mx-auto"
        >
          Looks like the teacher had removed you from the poll system. Please try again sometime.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default KickedOutScreen;