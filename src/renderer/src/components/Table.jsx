import React, { useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const Table = ({ rowData, columnDefs, onCellValueChanged, onGridReady }) => {
  const onGridReadyCallback = useCallback(
    (params) => {
      if (onGridReady) {
        onGridReady(params.api)
      }
    },
    [onGridReady]
  )

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        onCellValueChanged={onCellValueChanged}
        onGridReady={onGridReadyCallback}
      />
    </div>
  )
}

export default Table
