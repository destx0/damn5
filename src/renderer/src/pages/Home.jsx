import React, { useState, useCallback, useEffect } from 'react'
import Table from '../components/Table'
import ImportExport from '../components/ImportExport'
import columnDefs from '../utils/columnDefs'

const Home = () => {
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
    console.log('Imported data in Home component:', importedData)
    setRowData(importedData)
  }

  return (
    <div>
      <h1>Student Management System</h1>
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

export default Home