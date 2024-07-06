import React, { useState } from 'react'

const AddStudent = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    aadharNo: '',
    name: '',
    surname: '',
    fathersName: '',
    mothersName: '',
    religion: '',
    caste: '',
    subCaste: '',
    placeOfBirth: '',
    taluka: '',
    district: '',
    state: '',
    dob: '',
    lastAttendedSchool: '',
    lastSchoolStandard: '',
    dateOfAdmission: '',
    admissionStandard: '',
    progress: '',
    conduct: '',
    dateOfLeaving: '',
    currentStandard: '',
    reasonOfLeaving: '',
    remarks: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await window.api.addStudent(formData)
    if (result.success) {
      alert('Student added successfully!')
      setFormData({}) // Reset form
    } else {
      alert('Failed to add student. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Add Student</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {Object.keys(formData).map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type={field.includes('date') ? 'date' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={
                  field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
                }
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          ))}
          <div className="col-span-2 flex items-center justify-end mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStudent
