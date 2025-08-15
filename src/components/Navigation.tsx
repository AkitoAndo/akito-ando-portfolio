import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const Navigation: React.FC = () => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'ホーム', command: 'cd ~' },
    { path: '/about', label: 'プロフィール', command: 'cat ~/.profile' },
    { path: '/projects', label: 'プロジェクト', command: 'ls ~/projects' },
    { path: '/contact', label: 'コンタクト', command: 'cat ~/.contacts' }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="terminal mb-4">
      <div className="flex justify-between align-center mb-4">
        <div className="flex align-center">
          <span className="prompt">$</span>
          <span className="command">whoami</span>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="メニューを開く"
        >
          <span className="command">
            {isMenuOpen ? '✕' : '≡'}
          </span>
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-wrap gap-6">
        {navItems.map(({ path, label, command }) => (
          <motion.div
            key={path}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to={path}
              className={`flex align-center gap-2 ${
                isActive(path) 
                  ? 'text-green-400' 
                  : 'text-gray-300 hover:text-green-300'
              }`}
            >
              <span className="prompt">$</span>
              <span className="command">{command}</span>
              <span className="output">→ {label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className="md:hidden"
        initial={false}
        animate={{
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-600">
          {navItems.map(({ path, label, command }) => (
            <Link
              key={path}
              to={path}
              className={`flex align-center gap-2 ${
                isActive(path) 
                  ? 'text-green-400' 
                  : 'text-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="prompt">$</span>
              <span className="command">{command}</span>
              <span className="output">→ {label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </nav>
  )
}

export default Navigation