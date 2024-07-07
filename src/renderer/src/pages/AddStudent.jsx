import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

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

  const formatLabel = (field) => {
    return field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
  }

  return (
    <div className="container mx-auto p-4 h-full">
      <Card className="h-full flex flex-col relative">
        <CardHeader>
          <CardTitle>Add Student</CardTitle>
          <CardDescription>
            Enter the student's details below. Use YYYY-MM-DD format for dates.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full p-4 ">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(formData).map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>{formatLabel(field)}</Label>
                  <Input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field.includes('date') ? 'YYYY-MM-DD' : formatLabel(field)}
                    required
                    pattern={field.includes('date') ? '\\d{4}-\\d{2}-\\d{2}' : undefined}
                    title={field.includes('date') ? 'Enter date in YYYY-MM-DD format' : undefined}
                  />
                </div>
              ))}
            </form>
          </ScrollArea>
        </CardContent>
        <div className="absolute bottom-6 right-6">
          <Button
            onClick={handleSubmit}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            Add Student
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default AddStudent
