import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavMenu from './components/NavMenu' // Assuming you save the NavMenu component in this path
import Home from './pages/Home'
import AddStudent from './pages/AddStudent'
import ImportExport from './pages/ImportExport'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 w-full border-b bg-background">
          <div className="container flex h-16 items-center">
            <NavMenu />
          </div>
        </header>
        <main className="container py-6">
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
