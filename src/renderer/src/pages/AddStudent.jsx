import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserPlus, UserCheck, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Datepicker from 'react-tailwindcss-datepicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { initialFormData } from './formData'
import {
  iconVariants,
  buttonVariants,
  formContainerVariants,
  formItemVariants
} from './animationVariants'
import { formatLabel } from './utils'
import { useLocation, useNavigate } from 'react-router-dom'
import generateCertificate from '@/components/generateCertificate'

const AddStudent = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [customInputs, setCustomInputs] = useState({
    progress: false,
    conduct: false,
    remarks: false,
    reasonOfLeaving: false
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state && location.state.studentData) {
      setFormData(location.state.studentData)
      setIsEditMode(true)
    }
  }, [location])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSelectChange = (name, value) => {
    if (value === 'custom') {
      setCustomInputs((prev) => ({ ...prev, [name]: true }))
      setFormData((prevData) => ({ ...prevData, [name]: '' }))
    } else {
      setCustomInputs((prev) => ({ ...prev, [name]: false }))
      setFormData((prevData) => ({ ...prevData, [name]: value }))
    }
  }

  const handleDateChange = (name, dateValue) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: dateValue.startDate
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      let result
      if (isEditMode) {
        result = await window.api.updateStudent(formData)
      } else {
        result = await window.api.addStudent(formData)
      }
      if (result.success) {
        toast.success(isEditMode ? 'Student updated successfully!' : 'Student added successfully!')
        navigate('/')
      } else {
        throw new Error(result.error || 'An unknown error occurred')
      }
    } catch (error) {
      console.error('Error adding/updating student:', error)
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} student: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAndGenerateCertificate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await window.api.addStudent(formData)
      if (result.success && result.id) {
        toast.success('Student added successfully!')
        const updatedStudent = { ...formData, id: result.id }
        await generateCertificate(updatedStudent)
        toast.success('Certificate generated successfully!')
        navigate('/')
      } else {
        throw new Error(result.error || 'Failed to add student')
      }
    } catch (error) {
      console.error('Error adding student or generating certificate:', error)
      toast.error(`Failed to add student or generate certificate: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateAndGenerateCertificate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await window.api.updateStudent(formData)
      if (result.success) {
        toast.success('Student updated successfully!')
        await generateCertificate(formData)
        toast.success('Certificate generated successfully!')
        navigate('/')
      } else {
        throw new Error(result.error || 'Failed to update student')
      }
    } catch (error) {
      console.error('Error updating student or generating certificate:', error)
      toast.error(`Failed to update student or generate certificate: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const renderButtons = () => {
    if (isEditMode) {
      return (
        <div className="flex space-x-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-2"
          >
            <motion.div variants={iconVariants}>
              <UserCheck className="mr-2 h-4 w-4" />
            </motion.div>
            <span>{isLoading ? 'Updating...' : 'Update Student'}</span>
          </Button>
          <Button
            onClick={handleUpdateAndGenerateCertificate}
            disabled={isLoading}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-2"
          >
            <motion.div variants={iconVariants}>
              <FileText className="mr-2 h-4 w-4" />
            </motion.div>
            <span>{isLoading ? 'Processing...' : 'Update and Generate Certificate'}</span>
          </Button>
        </div>
      )
    } else {
      return (
        <div className="flex space-x-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-2"
          >
            <motion.div variants={iconVariants}>
              <UserPlus className="mr-2 h-4 w-4" />
            </motion.div>
            <span>{isLoading ? 'Adding...' : 'Add Student'}</span>
          </Button>
          <Button
            onClick={handleAddAndGenerateCertificate}
            disabled={isLoading}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-2"
          >
            <motion.div variants={iconVariants}>
              <FileText className="mr-2 h-4 w-4" />
            </motion.div>
            <span>{isLoading ? 'Processing...' : 'Add and Generate Certificate'}</span>
          </Button>
        </div>
      )
    }
  }

  const renderField = (field) => {
    if (field === 'id') return null

    if (['dateOfBirth', 'dateOfAdmission', 'dateOfLeaving'].includes(field)) {
      return (
        <Datepicker
          asSingle={true}
          useRange={false}
          value={{ startDate: formData[field], endDate: formData[field] }}
          onChange={(value) => handleDateChange(field, value)}
          displayFormat="YYYY-MM-DD"
          placeholder={`Select ${formatLabel(field)}`}
          inputClassName="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      )
    }

    if (['progress', 'conduct', 'remarks', 'reasonOfLeaving'].includes(field)) {
      const options = {
        progress: ['Excellent', 'Good', 'Average', 'Needs Improvement'],
        conduct: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement'],
        remarks: ['Outstanding', 'Satisfactory', 'Needs Attention'],
        reasonOfLeaving: ['Completed Studies', 'Transfer', 'Personal Reasons', 'Other']
      }

      return (
        <div className="flex flex-col space-y-2">
          <Select
            onValueChange={(value) => handleSelectChange(field, value)}
            value={customInputs[field] ? 'custom' : formData[field]}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${formatLabel(field)}`} />
            </SelectTrigger>
            <SelectContent>
              {options[field].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {customInputs[field] && (
            <Input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter custom ${formatLabel(field)}`}
            />
          )}
        </div>
      )
    }

    return (
      <Input
        type={field === 'certGenCount' ? 'number' : 'text'}
        id={field}
        name={field}
        value={formData[field]}
        onChange={handleChange}
        placeholder={formatLabel(field)}
        required
        min={field === 'certGenCount' ? '0' : undefined}
      />
    )
  }

  return (
    <div className="container mx-auto p-4 h-full">
      <Card className="h-full flex flex-col relative overflow-hidden">
        <CardHeader>
          <motion.div variants={formItemVariants} initial="hidden" animate="visible">
            <CardTitle>{isEditMode ? 'Edit Student' : 'Add Student'}</CardTitle>
            <CardDescription>
              {isEditMode
                ? "Edit the student's details below. Use the date picker for date fields and select options where available."
                : "Enter the student's details below. Use the date picker for date fields and select options where available."}
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full p-4">
            <motion.form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {Object.keys(formData).map(
                (field) =>
                  field !== 'id' && (
                    <motion.div key={field} className="space-y-2" variants={formItemVariants}>
                      <Label htmlFor={field}>{formatLabel(field)}</Label>
                      {renderField(field)}
                    </motion.div>
                  )
              )}
            </motion.form>
          </ScrollArea>
        </CardContent>
        <div className="absolute bottom-6 right-6 p-4">
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            {renderButtons()}
          </motion.div>
        </div>
      </Card>
    </div>
  )
}

export default AddStudent
