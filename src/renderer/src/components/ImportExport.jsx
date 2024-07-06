import React from 'react'

const ImportExport = ({ onDataImported }) => {
  const handleImport = async () => {
    try {
      const result = await window.api.importExcelAndSave()
      console.log('Import and save result:', result)
      if (result.success) {
        console.log('Imported and saved data:', result.data)
        onDataImported(result.data)
        alert('File imported and data saved successfully!')
      } else {
        console.error('Failed to import and save file:', result.reason || result.error)
        alert('Failed to import and save file. Please try again.')
      }
    } catch (error) {
      console.error('Error importing and saving file:', error)
      alert('Failed to import and save file. Please try again.')
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
