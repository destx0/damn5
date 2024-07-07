import React, { useState, useCallback, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ActionCellRenderer } from './ActionCellRenderer'
import { columnDefs } from './columnDefs'

const AdvancedTable = ({ rowData, setRowData, onCellValueChanged, quickFilterText }) => {
  const [columnDefinitions] = useState(columnDefs)

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      width: 120,
      editable: true,
      filter: true // Enable filtering for all columns
    }),
    []
  )

  const handleCellValueChanged = useCallback(
    (event) => {
      console.log('Cell value changed:', event)
      onCellValueChanged(event)
    },
    [onCellValueChanged]
  )

  return (
    <div className="ag-theme-alpine w-full h-full text-sm">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefinitions}
        defaultColDef={defaultColDef}
        onCellValueChanged={handleCellValueChanged}
        domLayout="normal"
        rowSelection={'multiple'}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        headerHeight={32}
        rowHeight={32}
        quickFilterText={quickFilterText} // Add this line for quick filter
      />
    </div>
  )
}

export default AdvancedTable
