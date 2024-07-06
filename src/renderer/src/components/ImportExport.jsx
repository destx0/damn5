import React from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const ImportExport = ({ onDataImported, gridApi }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      const bstr = event.target.result
      const workbook = XLSX.read(bstr, { type: 'binary' })
      const worksheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[worksheetName]
      const data = XLSX.utils.sheet_to_json(worksheet)
      onDataImported(data)
    }
    reader.readAsBinaryString(file)
  }

  const exportToCsv = () => {
    if (gridApi) {
      const params = {
        skipHeader: false,
        skipFooters: true,
        skipGroups: true,
        fileName: 'export.csv'
      }
      gridApi.exportDataAsCsv(params)
    }
  }

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <button onClick={exportToCsv}>Export to CSV</button>
    </div>
  )
}

export default ImportExport
