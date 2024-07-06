import React, { useState, useCallback, useEffect } from 'react'
import AdvancedTable from '../components/AdvancedTable' // Import the new AdvancedTable component
import { Button } from '@renderer/components/ui/button'

const Home = () => {
  const [rowData, setRowData] = useState([])

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student Management System</h1>
      <Button variant="outline" className="mb-4">
        Button
      </Button>

      <AdvancedTable rowData={rowData} onCellValueChanged={onCellValueChanged} />
    </div>
  )
}

export default Home
