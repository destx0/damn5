import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavMenu from './components/NavMenu'
import Home from './pages/Home'
import AddStudent from './pages/AddStudent'
import ImportExport from './pages/ImportExport'

const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <header className="flex-shrink-0 w-full border-b bg-background">
          <div className="container flex h-16 items-center">
            <NavMenu />
          </div>
        </header>
        <main className="flex-grow overflow-hidden">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/import-export" element={<ImportExport />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
