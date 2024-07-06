import React from 'react'

const ImportExport = ({ onDataImported, gridApi }) => {
  const handleImport = async () => {
    try {
      const result = await window.api.openFileDialog()
      console.log('Import result:', result)
      if (result.success) {
        console.log('Imported data:', result.data)
        if (Array.isArray(result.data) && result.data.length > 0) {
          onDataImported(result.data)
          alert('File imported successfully!')
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
    if (gridApi) {
      const params = {
        skipHeader: false,
        skipFooters: true,
        skipGroups: true,
        fileName: 'export.csv'
      }
      const csvContent = gridApi.getDataAsCsv(params)
      try {
        const result = await window.api.saveFileDialog(csvContent)
        if (result.success) {
          console.log('File saved successfully at:', result.filePath)
          alert('File exported successfully!')
        } else {
          console.log('File save was cancelled or failed')
          alert('File export was cancelled or failed.')
        }
      } catch (error) {
        console.error('Error exporting file:', error)
        alert('Failed to export file. Please try again.')
      }
    } else {
      console.error('Grid API is not available')
      alert('Unable to export. Grid API is not available.')
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
