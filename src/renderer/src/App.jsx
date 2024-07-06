import React, { useState, useCallback, useEffect } from 'react'
import AddStudentForm from './components/AddStudentForm'
import Table from './components/Table'
import generateCertificate from './components/generateCertificate'
import ImportExport from './components/ImportExport'

const App = () => {
  const [rowData, setRowData] = useState([])
  const [gridApi, setGridApi] = useState(null)

  const fetchStudents = async () => {
    try {
      const result = await window.api.getStudents()
      if (result.success) {
        setRowData(result.data)
      } else {
        console.error('Failed to fetch students:', result.error)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const columnDefs = [
    { field: 'id', editable: false },
    { field: 'name', editable: true },
    { field: 'grade', editable: true },
    {
      headerName: 'Actions',
      cellRenderer: (params) => {
        const button = document.createElement('button')
        button.innerText = 'Generate Certificate'
        button.addEventListener('click', () => generateCertificate(params.data))
        return button
      }
    }
  ]

  const onAddStudent = async (newStudent) => {
    try {
      const result = await window.api.addStudent(newStudent)
      if (result.success) {
        fetchStudents()
      } else {
        console.error('Failed to add student:', result.error)
      }
    } catch (error) {
      console.error('Error adding student:', error)
    }
  }

  const onCellValueChanged = async (event) => {
    const updatedStudent = event.data
    try {
      const result = await window.api.updateStudent(updatedStudent)
      if (!result.success) {
        console.error('Failed to update student:', result.error)
        fetchStudents() // Revert to original data if update fails
      }
    } catch (error) {
      console.error('Error updating student:', error)
      fetchStudents() // Revert to original data if update fails
    }
  }

  const onGridReady = useCallback((api) => {
    setGridApi(api)
  }, [])

  const handleDataImported = (importedData) => {
    console.log('Imported data in App component:', importedData)
    setRowData(importedData)
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
