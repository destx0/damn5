import React from 'react'
import { MoreVertical, Trash2, Award } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import generateCertificate from './generateCertificate'

export const ActionCellRenderer = (params) => {
  const handleDelete = async () => {
    console.log('Delete clicked for row:', params.data)
    try {
      const result = await window.api.deleteStudent(params.data.id)
      if (result.success) {
        toast.success(
          'Student Deleted',
          'The student has been successfully deleted from the database.'
        )
        // Refresh the grid data
        params.api.applyTransaction({ remove: [params.data] })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      toast.error('Error', 'There was an error deleting the student. Please try again.')
    }
  }

  const handleGenerateCertificate = async () => {
    try {
      await generateCertificate(params.data)
      toast.success(
        'Certificate Generated',
        'The comprehensive A4 certificate has been generated and downloaded.'
      )
    } catch (error) {
      console.error('Error generating certificate:', error)
      toast.error('Error', 'There was an error generating the certificate. Please try again.')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleGenerateCertificate}>
          <Award className="mr-2 h-4 w-4 text-yellow-500" />
          <span>Generate Certificate</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
