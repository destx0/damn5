import React, { useEffect, useRef, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const Table = ({ rowData, columnDefs, onCellValueChanged, onGridReady }) => {
  const gridRef = useRef(null)

  const onGridReadyInternal = useCallback(
    (params) => {
      console.log('Grid ready event fired')
      if (onGridReady) onGridReady(params.api)
    },
    [onGridReady]
  )

  useEffect(() => {
    console.log('Table component rendered')
    console.log('rowData:', rowData)
    console.log('columnDefs:', columnDefs)

    if (gridRef.current && gridRef.current.api) {
      console.log('Updating grid data')
      gridRef.current.api.setGridOption('rowData', rowData)
    }
  }, [rowData, columnDefs])

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        onCellValueChanged={onCellValueChanged}
        onGridReady={onGridReadyInternal}
      />
    </div>
  )
}

export default Table
