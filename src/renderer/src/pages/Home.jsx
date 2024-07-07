import React, { useState, useCallback, useEffect } from 'react'
import AdvancedTable from '../components/AdvancedTable'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'

const Home = () => {
  const [rowData, setRowData] = useState([])
  const [quickFilterText, setQuickFilterText] = useState('')

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
          // Optionally, add a user-facing error message here
        }
      } catch (error) {
        console.error('Error updating student:', error)
        // Revert to original data if update fails
        fetchStudents()
        // Optionally, add a user-facing error message here
      }
    },
    [fetchStudents]
  )

  const handleRefresh = useCallback(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleQuickFilterChange = useCallback((event) => {
    setQuickFilterText(event.target.value)
  }, [])

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4 flex items-center space-x-4">
        <Button onClick={handleRefresh} variant="outline">
          Refresh Data
        </Button>
        <Input
          type="text"
          placeholder="Quick filter..."
          value={quickFilterText}
          onChange={handleQuickFilterChange}
          className="max-w-sm"
        />
      </div>
      <div className="flex-grow">
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
