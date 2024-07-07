import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const iconVariants = {
  hover: { scale: 1.2, transition: { type: 'spring', stiffness: 300 } },
  tap: { scale: 0.8, transition: { type: 'spring', stiffness: 300 } }
}

const buttonVariants = {
  hidden: { opacity: 1, x: 450, scale: 0.01 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { ease: 'easeIn', duration: 0.3 } },
  hover: { scale: 1.05, transition: { type: 'spring', stiffness: 300 } },
  tap: { scale: 0.95, transition: { type: 'spring', stiffness: 300 } }
}

const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.01,
      staggerChildren: 0.01
    }
  }
}

const formItemVariants = {
  hidden: { opacity: 0, x: 250 },
  visible: { opacity: 1, x: 0, transition: { ease: 'easeIn', duration: 0.1 } }
}

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
    dateOfBirth: '',
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
    try {
      const result = await window.api.addStudent(formData)
      if (result.success) {
        toast.success('Student added successfully!')
        setFormData({
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
          dateOfBirth: '',
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
        }) // Reset form
      } else {
        toast.error('Failed to add student. Please try again.')
      }
    } catch (error) {
      console.error('Error adding student:', error)
      toast.error(`Failed to add student: ${error.message}`)
    }
  }

  const formatLabel = (field) => {
    return field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
  }

  return (
    <div className="container mx-auto p-4 h-full">
      <Card className="h-full flex flex-col relative overflow-hidden">
        <CardHeader>
          <motion.div variants={formItemVariants} initial="hidden" animate="visible">
            <CardTitle>Add Student</CardTitle>
            <CardDescription>
              Enter the student's details below. Use YYYY-MM-DD format for dates.
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
              {Object.keys(formData).map((field) => (
                <motion.div key={field} className="space-y-2" variants={formItemVariants}>
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
                </motion.div>
              ))}
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
            <Button
              onClick={handleSubmit}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-2"
            >
              <motion.div variants={iconVariants}>
                <UserPlus className="mr-2 h-4 w-4" />
              </motion.div>
              <span>Add Student</span>
            </Button>
          </motion.div>
        </div>
      </Card>
    </div>
  )
}

export default AddStudent
