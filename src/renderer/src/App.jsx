import React from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import NavMenu from '@/components/NavMenu'
import Home from '@/pages/Home'
import AddStudent from '@/pages/AddStudent'
import wavyLinesBg from '@/assets/wavy-lines.svg'

const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100">
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
  </svg>
)

const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <header className="flex-shrink-0 w-full border-b bg-background z-50">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Logo />
              <h1 className="text-xl font-bold">JACCD</h1>
            </div>
            <NavMenu />
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
              <Route path="/" element={<Home />} />
              <Route path="/add-student" element={<AddStudent />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
