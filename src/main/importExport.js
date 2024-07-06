import React from 'react'

const ImportExport = ({ onDataImported }) => {
  const handleImport = async () => {
    try {
      const result = await window.api.openFileDialog()
      console.log('Import result:', result)
      if (result.success) {
        console.log('Raw imported data:', result.data)
        if (Array.isArray(result.data) && result.data.length > 0) {
          const formattedData = result.data.map((item) => ({
            id: item.Id || item.id,
            name: item.Name || item.name,
            grade: item.Grade || item.grade
          }))
          console.log('Formatted data:', formattedData)

          // Bulk insert the imported data
          const bulkInsertResult = await window.api.bulkInsertStudents(formattedData)
          if (bulkInsertResult.success) {
            onDataImported(formattedData)
            alert('File imported and data saved successfully!')
          } else {
            console.error('Failed to save imported data:', bulkInsertResult.error)
            alert('File imported but failed to save data. Please try again.')
          }
        } else {
          console.error('Imported data is empty or not an array')
          alert('Imported data is empty or invalid. Please check the file content.')
        }
      } else {
        console.error('Failed to import file:', result.reason || result.error)
        alert('Failed to import file. Please try again.')
      }
    } catch (error) {
      console.error('Error importing file:', error)
      alert('Failed to import file. Please try again.')
    }
  }

  const handleExport = async () => {
    try {
      const result = await window.api.getStudents()
      if (result.success) {
        const csvContent = result.data.map((s) => `${s.id},${s.name},${s.grade}`).join('\n')
        const exportResult = await window.api.saveFileDialog(`id,name,grade\n${csvContent}`)
        if (exportResult.success) {
          console.log('File saved successfully at:', exportResult.filePath)
          alert('File exported successfully!')
        } else {
          console.log('File save was cancelled or failed')
          alert('File export was cancelled or failed.')
        }
      } else {
        console.error('Failed to fetch students for export:', result.error)
        alert('Failed to export file. Please try again.')
      }
    } catch (error) {
      console.error('Error exporting file:', error)
      alert('Failed to export file. Please try again.')
    }
  }

  return (
    <div>
      <button onClick={handleImport}>Import from Excel</button>
      <button onClick={handleExport}>Export to CSV</button>
    </div>
  )
}

export default ImportExport
