import React from 'react';
import { motion } from 'framer-motion';

const HeroImage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="relative h-full w-full max-w-xl mx-auto">
      <motion.div
        className="relative z-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 border border-gray-200 dark:border-gray-700"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3 mb-3">
          <div className="flex items-center justify-between">
            <motion.div variants={itemVariants} className="text-lg font-semibold">
              My Project Board
            </motion.div>
            <motion.div variants={itemVariants} className="flex space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary/20"></div>
              <div className="w-6 h-6 rounded-full bg-primary/80"></div>
            </motion.div>
          </div>
        </div>

        {/* Columns */}
        <div className="flex space-x-3 overflow-x-auto p-1">
          {/* To Do Column */}
          <motion.div 
            variants={itemVariants}
            className="flex-shrink-0 w-64 bg-gray-50 dark:bg-gray-900 rounded-md p-2"
          >
            <div className="font-medium mb-2 p-1">To Do</div>
            {/* Cards */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-2 rounded mb-2 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-sm">Design landing page</div>
              <div className="flex items-center mt-2">
                <div className="w-4 h-4 rounded-full bg-red-400"></div>
                <div className="text-xs text-gray-500 ml-1">High</div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-2 rounded mb-2 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-sm">Create API endpoints</div>
              <div className="flex items-center mt-2">
                <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                <div className="text-xs text-gray-500 ml-1">Medium</div>
              </div>
            </motion.div>
          </motion.div>

          {/* In Progress Column */}
          <motion.div 
            variants={itemVariants}
            className="flex-shrink-0 w-64 bg-gray-50 dark:bg-gray-900 rounded-md p-2"
          >
            <div className="font-medium mb-2 p-1">In Progress</div>
            {/* Cards */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-2 rounded mb-2 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-sm">Setup authentication</div>
              <div className="flex items-center mt-2">
                <div className="w-4 h-4 rounded-full bg-red-400"></div>
                <div className="text-xs text-gray-500 ml-1">High</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Done Column */}
          <motion.div 
            variants={itemVariants}
            className="flex-shrink-0 w-64 bg-gray-50 dark:bg-gray-900 rounded-md p-2"
          >
            <div className="font-medium mb-2 p-1">Done</div>
            {/* Cards */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-2 rounded mb-2 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-sm">Project setup</div>
              <div className="flex items-center mt-2">
                <div className="w-4 h-4 rounded-full bg-green-400"></div>
                <div className="text-xs text-gray-500 ml-1">Completed</div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-2 rounded mb-2 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-sm">Database design</div>
              <div className="flex items-center mt-2">
                <div className="w-4 h-4 rounded-full bg-green-400"></div>
                <div className="text-xs text-gray-500 ml-1">Completed</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/4 -z-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -z-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default HeroImage;