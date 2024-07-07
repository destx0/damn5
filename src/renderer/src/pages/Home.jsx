import React, { useState, useCallback, useEffect } from 'react'
import AdvancedTable from '../components/AdvancedTable'
import { Button } from '@renderer/components/ui/button'

const Home = () => {
  const [rowData, setRowData] = useState([])

  const fetchStudents = useCallback(async () => {
    try {
      const result = await window.api.getStudents()
      if (result.success) {
        setRowData(result.data)
      } else {
        console.error('Failed to fetch students:', result.error)
        // Optionally, you can add a user-facing error message here
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      // Optionally, you can add a user-facing error message here
    }
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const onCellValueChanged = useCallback(
    async (event) => {
      const { data: updatedStudent } = event
      try {
        const result = await window.api.updateStudent(updatedStudent)
        if (result.success) {
          // Update local state
          setRowData((prevRowData) =>
            prevRowData.map((row) => (row.id === updatedStudent.id ? updatedStudent : row))
          )
        } else {
          console.error('Failed to update student:', result.error)
          // Revert to original data if update fails
          fetchStudents()
          // Optionally, you can add a user-facing error message here
        }
      } catch (error) {
        console.error('Error updating student:', error)
        // Revert to original data if update fails
        fetchStudents()
        // Optionally, you can add a user-facing error message here
      }
    },
    [fetchStudents]
  )

  const handleRefresh = useCallback(() => {
    fetchStudents()
  }, [fetchStudents])

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Button onClick={handleRefresh}>Refresh Data</Button>
      </div>
      <div className="flex-grow">
        <AdvancedTable
          rowData={rowData}
          setRowData={setRowData}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  )
}

export default Home
