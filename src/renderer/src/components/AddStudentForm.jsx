import React, { useState } from 'react'

const AddStudentForm = ({ onAddStudent }) => {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddStudent({ id: Date.now(), name, grade })
    setName('')
    setGrade('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Student Name"
        required
      />
      <input
        type="text"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        placeholder="Grade"
        required
      />
      <button type="submit">Add Student</button>
    </form>
  )
}

export default AddStudentForm
