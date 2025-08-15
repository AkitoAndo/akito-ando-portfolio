import React from 'react'
import { motion } from 'framer-motion'
import Navigation from './Navigation'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <motion.main
        className="flex-1 terminal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ minHeight: 'calc(100vh - 140px)' }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  )
}

export default Layout