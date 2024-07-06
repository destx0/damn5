import React from 'react'
import * as XLSX from 'xlsx'

const ImportExport = ({ onDataImported, gridApi }) => {
  const handleImport = async () => {
    try {
      const result = await window.api.openFileDialog()
      if (result.filePaths && result.filePaths.length > 0) {
        const filePath = result.filePaths[0]
        const workbook = XLSX.readFile(filePath)
        const worksheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[worksheetName]
        const data = XLSX.utils.sheet_to_json(worksheet)
        onDataImported(data)
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
