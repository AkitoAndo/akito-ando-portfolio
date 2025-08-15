import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  message?: string
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "読み込み中", 
  className = "" 
}) => {
  const dotVariants = {
    initial: { opacity: 0.3 },
    animate: { opacity: 1 },
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 1
      }
    }
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="mb-4">
          <div className="prompt">$</div>
          <div className="command">loading...</div>
        </div>
        
        <div className="output">
          <motion.div
            className="flex items-center justify-center space-x-1 mb-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-green-400 rounded-full"
                variants={dotVariants}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.2
                }}
              />
            ))}
          </motion.div>
          
          <motion.p 
            className="text-gray-300 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {message}
          </motion.p>
          
          <motion.div
            className="mt-4 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="prompt">$</div>
            <motion.span
              className="cursor ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              █
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner