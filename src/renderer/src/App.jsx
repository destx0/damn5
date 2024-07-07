import React, { useState, useCallback } from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import NavMenu from '@/components/NavMenu'
import Home from '@/pages/Home'
import AddStudent from '@/pages/AddStudent'
import wavyLinesBg from '@/assets/wavy-lines.svg'
import { Input } from '@renderer/components/ui/input'
import { Button } from '@renderer/components/ui/button'
import { Search, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import classNames from 'classnames'

const iconVariants = {
  hover: { scale: 1.2 },
  tap: { scale: 0.8 },
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300 } }
}

const Logo = ({ isRotating }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 100 100"
    className={classNames({ 'rotate-animation': isRotating })}
    whileHover={{ rotate: 360 }}
  >
    <rect x="10" y="20" width="80" height="60" fill="#f0f0f0" stroke="#333" strokeWidth="2" />
    <rect
      x="15"
      y="25"
      width="70"
      height="50"
      fill="none"
      stroke="#333"
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <text
      x="50"
      y="55"
      fontFamily="Arial, sans-serif"
      fontSize="24"
      textAnchor="middle"
      fill="#333"
    >
      Jaccd
    </text>
    <path d="M30 80 Q50 90 70 80" fill="none" stroke="#333" strokeWidth="2" />
    <circle cx="50" cy="85" r="8" fill="#ffd700" stroke="#333" strokeWidth="1" />
    <path d="M46 85 L50 89 L54 82" fill="none" stroke="#333" strokeWidth="1.5" />
  </motion.svg>
)

const App = () => {
  const [quickFilterText, setQuickFilterText] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isRotating, setIsRotating] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const handleQuickFilterChange = useCallback((event) => {
    setQuickFilterText(event.target.value)
  }, [])

  const handleRefresh = useCallback(() => {
    setIsRotating(true)
    setRefreshTrigger((prev) => prev + 1)
    setTimeout(() => setIsRotating(false), 1000) // Rotate for 1 second
  }, [])

  const toggleSelection = () => {
    setIsSelected(!isSelected)
  }

  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <header className="flex-shrink-0 w-full border-b bg-background z-50 bg-gray-200">
          <div className="container flex h-16 items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Logo isRotating={isRotating} />
              <h1 className="text-xl font-bold">Jaccd</h1>
            </div>
            <NavMenu />
            <div className="flex-grow"></div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Quick filter..."
                value={quickFilterText}
                onChange={handleQuickFilterChange}
                className="pl-10 pr-4 py-2 w-64"
              />
              <motion.div
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                variants={iconVariants}
              >
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </motion.div>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                variants={iconVariants}
              >
                <RefreshCw size={18} className={classNames({ 'rotate-animation': isRotating })} />
              </motion.div>
              <span>Refresh</span>
            </Button>
          </div>
        </header>
        <main
          className="flex-grow overflow-hidden p-4 relative z-0"
          style={{
            backgroundImage: `url(${wavyLinesBg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div>
          <div className="relative z-10 h-full overflow-auto">
            <Routes>
              <Route
                path="/"
                element={<Home quickFilterText={quickFilterText} refreshTrigger={refreshTrigger} />}
              />
              <Route path="/add-student" element={<AddStudent />} />
            </Routes>
            <Button onClick={toggleSelection} className="mt-4">
              Toggle Selection
            </Button>
            {isSelected ? <motion.div layoutId="underline" className="underline" /> : null}
            {!isSelected ? <motion.div layoutId="underline" className="underline" /> : null}
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
