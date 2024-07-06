import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Home from './pages/Home'
import AddStudent from './pages/AddStudent'
import ImportExport from './pages/ImportExport'

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/add-student">Add Student</Link>
          </li>
          <li>
            <Link to="/import-export">Import/Export</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/import-export" element={<ImportExport />} />
      </Routes>
    </Router>
  )
}

export default App
