import React, { useState, useCallback, useEffect } from 'react'
import AdvancedTable from '../components/AdvancedTable'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Search, RefreshCw } from 'lucide-react'

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

  const handleRefresh = useCallback(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleQuickFilterChange = useCallback((event) => {
    setQuickFilterText(event.target.value)
  }, [])

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-6 flex justify-center items-center space-x-4 ">
        <div className="flex items-center max-w-md w-full">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Quick filter..."
              value={quickFilterText}
              onChange={handleQuickFilterChange}
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="flex items-center space-x-2">
          <RefreshCw size={18} />
          <span>Refresh</span>
        </Button>
      </div>
      <div className="flex-grow px-4">
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
