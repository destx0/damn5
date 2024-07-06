import React from 'react'

const ImportExport = () => {
  const handleImport = async () => {
    try {
      const result = await window.api.importExcelAndSave()
      if (result.success) {
        alert('File imported and data saved successfully!')
      } else {
        alert('Failed to import and save file. Please try again.')
      }
    } catch (error) {
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
          alert('File exported successfully!')
        } else {
          alert('File export was cancelled or failed.')
        }
      } else {
        alert('Failed to export file. Please try again.')
      }
    } catch (error) {
      alert('Failed to export file. Please try again.')
    }
  }

  return (
    <div>
      <h1>Import/Export</h1>
      <button onClick={handleImport}>Import from Excel</button>
      <button onClick={handleExport}>Export to CSV</button>
    </div>
  )
}

export default ImportExport
