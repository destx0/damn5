import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Download, Upload, FileInput } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const ImportExportCard = () => {
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleImport = async () => {
    if (!selectedFile) {
      alert('Please select a file to import.')
      return
    }

    try {
      const result = await window.api.importFileAndSave(selectedFile.path)
      if (result.success) {
        alert('File imported and data saved successfully!')
        setSelectedFile(null) // Reset file input
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
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileInput className="h-5 w-5" />
          <span>Import/Export</span>
        </CardTitle>
        <CardDescription>Manage your student data</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="importFile" className="text-sm font-medium">
            Import File
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="importFile"
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="flex-grow"
            />
            <Button
              onClick={handleImport}
              className="flex items-center justify-center"
              disabled={!selectedFile}
              size="sm"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Select a CSV or XLSX file to import student data
          </p>
        </div>

        <Separator />

        <div className="grid gap-2">
          <Label htmlFor="exportButton" className="text-sm font-medium">
            Export Data
          </Label>
          <Button
            id="exportButton"
            onClick={handleExport}
            className="flex items-center justify-center w-full"
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" /> Export to XLSX
          </Button>
          <p className="text-xs text-muted-foreground">Export all student data to an XLSX file</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ImportExportCard
