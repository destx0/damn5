import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Home from './pages/Home'
import AddStudent from './pages/AddStudent'

const App = () => {
  const handleAddStudent = async (newStudent) => {
    try {
      const result = await window.api.addStudent(newStudent)
      if (result.success) {
        // Optionally, you can redirect to the Home page after adding a student
        console.log('Student added successfully')
      } else {
        console.error('Failed to add student:', result.error)
      }
    } catch (error) {
      console.error('Error adding student:', error)
    }
  }

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
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-student" element={<AddStudent onAddStudent={handleAddStudent} />} />
      </Routes>
    </Router>
  )
}

export default App
