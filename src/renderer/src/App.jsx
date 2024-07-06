import React, { useState, useCallback, useEffect } from 'react'
import AddStudentForm from './components/AddStudentForm'
import Table from './components/Table'
import generateCertificate from './components/generateCertificate'
import ImportExport from './components/ImportExport'

const App = () => {
  const [rowData, setRowData] = useState([
    { id: 1, name: 'John Doe', grade: 'A' },
    { id: 2, name: 'Jane Smith', grade: 'B' }
  ])

  const [gridApi, setGridApi] = useState(null)

  const [columnDefs] = useState([
    { field: 'id', editable: false },
    { field: 'name', editable: true },
    { field: 'grade', editable: true },
    {
      headerName: 'Actions',
      cellRenderer: (params) => (
        <button onClick={() => generateCertificate(params.data)}>Generate Certificate</button>
      )
    }
  ])

  useEffect(() => {
    console.log('rowData updated:', rowData)
    if (gridApi) {
      console.log('Updating grid data from App')
      gridApi.setGridOption('rowData', rowData)
    }
  }, [rowData, gridApi])

  const onAddStudent = (newStudent) => {
    setRowData((prevData) => {
      const newData = [...prevData, newStudent]
      console.log('New rowData after adding student:', newData)
      return newData
    })
  }

  const onCellValueChanged = (event) => {
    console.log('Cell value changed:', event)
    // Here you would typically update your data store
  }

  const onGridReady = useCallback((api) => {
    console.log('Grid API set in App component')
    setGridApi(api)
  }, [])

  const handleDataImported = (data) => {
    console.log('Data imported in App component:', data)
    setRowData(data)
  }

  return (
    <div>
      <h1>Student Management System</h1>
      <AddStudentForm onAddStudent={onAddStudent} />
      <ImportExport onDataImported={handleDataImported} gridApi={gridApi} />
      <Table
        rowData={rowData}
        columnDefs={columnDefs}
        onCellValueChanged={onCellValueChanged}
        onGridReady={onGridReady}
      />
    </div>
  )
}

export default App
