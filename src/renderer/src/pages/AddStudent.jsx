import React from 'react'
import AddStudentForm from '../components/AddStudentForm'

const AddStudent = ({ onAddStudent }) => {
  return (
    <div>
      <h1>Add Student</h1>
      <AddStudentForm onAddStudent={onAddStudent} />
    </div>
  )
}

export default AddStudent
