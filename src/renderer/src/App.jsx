import React from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import NavMenu from '@/components/NavMenu'
import Home from '@/pages/Home'
import AddStudent from '@/pages/AddStudent'
import wavyLinesBg from '@/assets/wavy-lines.svg'

const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <header className="flex-shrink-0 w-full border-b bg-background z-50">
          <div className="container flex h-16 items-center">
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
