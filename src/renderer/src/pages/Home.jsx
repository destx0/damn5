import React, { useState, useCallback, useEffect } from 'react'
import AdvancedTable from '../components/AdvancedTable'

const Home = ({ quickFilterText, refreshTrigger }) => {
  const [rowData, setRowData] = useState([])

  const fetchStudents = useCallback(async () => {
    try {
      const result = await window.api.getStudents()
      if (result.success) {
        setRowData(result.data)
      } else {
        console.error('Failed to fetch students:', result.error)
        // Optionally, add a user-facing error message here
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      // Optionally, add a user-facing error message here
    }
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents, refreshTrigger])

  const onCellValueChanged = useCallback(
    async (event) => {
      const { data: updatedStudent } = event
      try {
        const result = await window.api.updateStudent(updatedStudent)
        if (result.success) {
          setRowData((prevRowData) =>
            prevRowData.map((row) => (row.id === updatedStudent.id ? updatedStudent : row))
          )
        } else {
          console.error('Failed to update student:', result.error)
          fetchStudents()
        }
      } catch (error) {
        console.error('Error updating student:', error)
        fetchStudents()
      }
    },
    [fetchStudents]
  )

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow p-4">
        <AdvancedTable
          rowData={rowData}
          setRowData={setRowData}
          onCellValueChanged={onCellValueChanged}
          quickFilterText={quickFilterText}
        />
      </div>
    </div>
  )
}

export default Home
