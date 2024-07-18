// src/renderer/src/pages/AddStudent.jsx

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { initialFormData } from './formData'
import {
  iconVariants,
  buttonVariants,
  formContainerVariants,
  formItemVariants
} from './animationVariants'
import { formatLabel } from './utils'

const AddStudent = () => {
  const [formData, setFormData] = useState(initialFormData)

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
        setFormData(initialFormData) // Reset form
      } else {
        toast.error('Failed to add student. Please try again.')
      }
    } catch (error) {
      console.error('Error adding student:', error)
      toast.error(`Failed to add student: ${error.message}`)
    }
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
                    type={field === 'certGenCount' ? 'number' : 'text'}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field.includes('date') ? 'YYYY-MM-DD' : formatLabel(field)}
                    required
                    pattern={field.includes('date') ? '\\d{4}-\\d{2}-\\d{2}' : undefined}
                    title={field.includes('date') ? 'Enter date in YYYY-MM-DD format' : undefined}
                    min={field === 'certGenCount' ? '0' : undefined}
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
