import React from 'react'

const ImportExport = () => {
  const handleImport = async () => {
    console.log('Import button clicked')
    console.log('window.api:', window.api)
    try {
      console.log('Calling importFileAndSave')
      const result = await window.api.importFileAndSave()
      console.log('Import result:', result)
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
                  (header === 'dob' || header === 'dateOfAdmission' || header === 'dateOfLeaving')
                ) {
                  // Ensure date is in YYYY-MM-DD format
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Import/Export</h1>
      <div className="space-x-4">
        <button
          onClick={handleImport}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Import from Excel/CSV
        </button>
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to CSV
        </button>
      </div>
    </div>
  )
}

export default ImportExport
