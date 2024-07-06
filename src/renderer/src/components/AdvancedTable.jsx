import React, { useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { ActionCellRenderer } from './ActionCellRenderer'
import { columnDefs } from './columnDefs'

const AdvancedTable = ({ rowData }) => {
  const [columnDefinitions] = useState(columnDefs)

  const defaultColDef = {
    sortable: true,
    resizable: true,
    width: 120
  }

  const onCellValueChanged = useCallback((event) => {
    console.log('Cell value changed:', event)
    // Here you can add logic to update the database
  }, [])

  return (
    <div className="ag-theme-alpine w-full h-full text-sm">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefinitions}
        defaultColDef={defaultColDef}
        onCellValueChanged={onCellValueChanged}
        domLayout="normal"
        rowSelection={'multiple'}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        headerHeight={32}
        rowHeight={32}
      />
    </div>
  )
}

export default AdvancedTable
