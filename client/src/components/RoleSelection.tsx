import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserType } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import IntervueHeader from './IntervueHeader';

const RoleSelection: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      dispatch(setUserType(selectedRole));
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center flex flex-col justify-between items-center mb-12">
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
            transition={{ delay: 0.4 }}
          className="text-3xl md:text-[40px] md:whitespace-nowrap text-gray-900 mb-4 sora-font"
          >
            Welcome to the <span className="text-black font-semibold">Live Polling System</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-sm md:text-[17px] text-[#00000074] mx-auto sora-font"
          >
            Please select the role that best describes you to begin using the live polling system
          </motion.p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Student Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, type: 'spring', damping: 20 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl cursor-pointer transition-all border-0 duration-75
              ${
              selectedRole === 'student' 
                ? '[background:linear-gradient(92.24deg,_#7765DA_-8.5%,_#1D68BD_101.3%)] shadow-lg' 
                : 'bg-[#f0f0f0]'
            }
            `}
            onClick={() => handleRoleSelect('student')}
          >
            <div className="flex rounded-[10px] flex-col items-start gap-3 p-6 bg-white m-[3px]">
              <h3 className="text-[23px] leading-[100%] !font-semibold text-[#000000]  sora-font">I'm a Student</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry
              </p>
            </div>
          </motion.div>

          {/* Teacher Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, type: 'spring', damping: 20 }}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl cursor-pointer transition-all border-0 duration-75
              ${
              selectedRole === 'teacher' 
                ? '[background:linear-gradient(92.24deg,_#7765DA_-8.5%,_#1D68BD_101.3%)] shadow-lg' 
                : 'bg-[#f0f0f0]'
            }
            `}
            onClick={() => handleRoleSelect('teacher')}
          >
             <div className="flex rounded-[10px] flex-col items-start gap-3 p-6 bg-white m-[3px]">
              <h3 className="text-[23px] leading-[100%] !font-semibold text-[#000000] !sora-font">I'm a Teacher</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Submit answers and view live poll results in real-time.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: selectedRole ? 1.05 : 1 }}
            whileTap={{ scale: selectedRole ? 0.95 : 1 }}
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-16 py-3 rounded-full text-lg font-semibold transition-all ${
              selectedRole
                ? 'bg-[linear-gradient(99.18deg,_#8F64E1_-46.89%,_#1D68BD_223.45%)] text-white hover:opacity-90 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;