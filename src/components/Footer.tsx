import React from 'react'
import { motion } from 'framer-motion'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="terminal mt-4">
      <div className="flex justify-between align-center flex-wrap gap-4">
        <div className="flex align-center gap-2">
          <span className="prompt">$</span>
          <span className="command">echo &quot;© {currentYear} Akito Ando&quot;</span>
        </div>
        
        <div className="flex gap-4">
          <motion.a
            href="https://github.com/akito-ando"
            target="_blank"
            rel="noopener noreferrer"
            className="flex align-center gap-1 hover:text-green-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm">GitHub</span>
          </motion.a>
          
          <motion.a
            href="https://linkedin.com/in/akito-ando"
            target="_blank"
            rel="noopener noreferrer"
            className="flex align-center gap-1 hover:text-green-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm">LinkedIn</span>
          </motion.a>
        </div>
      </div>
      
      <div className="mt-4 flex align-center">
        <span className="prompt">$</span>
        <motion.span
          className="cursor ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          █
        </motion.span>
      </div>
    </footer>
  )
}

export default Footer