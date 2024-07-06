import React, { useState } from 'react'

const AddStudent = () => {
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await window.api.addStudent({ id: parseInt(id), name, grade })
    if (result.success) {
      alert('Student added successfully!')
      setId('')
      setName('')
      setGrade('')
    } else {
      alert('Failed to add student. Please try again.')
    }
  }

  return (
    <div>
      <h1>Add Student</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Student ID"
          required
        />
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
    </div>
  )
}

export default AddStudent
