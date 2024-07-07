import React from 'react'
import { Button } from '@/components/ui/button'
import { Download, Upload } from 'lucide-react'

const ImportExportCard = () => {
  const handleImport = async () => {
    try {
      const result = await window.api.importFileAndSave()
      if (result.success) {
        alert('File imported and data saved successfully!')
      } else {
        alert(`Failed to import and save file: ${result.reason || result.error}`)
      }
    } catch (error) {
      console.error('Import error:', error)
      alert(`Failed to import and save file: ${error.message}`)
    }
  }

  const handleExport = async () => {
    try {
      const result = await window.api.getStudents()
      if (result.success) {
        const headers = [
          'id',
          'studentId',
          'aadharNo',
          'name',
          'surname',
          'fathersName',
          'mothersName',
          'religion',
          'caste',
          'subCaste',
          'placeOfBirth',
          'taluka',
          'district',
          'state',
          'dob',
          'lastAttendedSchool',
          'lastSchoolStandard',
          'dateOfAdmission',
          'admissionStandard',
          'progress',
          'conduct',
          'dateOfLeaving',
          'currentStandard',
          'reasonOfLeaving',
          'remarks'
        ]

        const csvContent = result.data
          .map((student) =>
            headers
              .map((header) => {
                let value = student[header]
                if (
                  typeof value === 'string' &&
                  ['dob', 'dateOfAdmission', 'dateOfLeaving'].includes(header)
                ) {
                  const date = new Date(value)
                  value = date.toISOString().split('T')[0]
                }
                return typeof value === 'string' ? `"${value}"` : value
              })
              .join(',')
          )
          .join('\n')

        const exportResult = await window.api.saveFileDialog(`${headers.join(',')}\n${csvContent}`)
        if (exportResult.success) {
          alert('File exported successfully!')
        } else {
          alert(`File export was cancelled or failed: ${exportResult.reason || exportResult.error}`)
        }
      } else {
        alert(`Failed to export file: ${result.error}`)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert(`Failed to export file: ${error.message}`)
    }
  }

  return (
    <div className="p-4 md:w-[400px]">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Import/Export</h3>
        <p className="text-sm text-muted-foreground">Manage your student data</p>
      </div>
      <div className="grid gap-4">
        <Button onClick={handleImport} className="flex items-center justify-start">
          <Upload className="mr-2 h-4 w-4" /> Import Data
        </Button>
        <Button onClick={handleExport} className="flex items-center justify-start">
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>
    </div>
  )
}

export default ImportExportCard
