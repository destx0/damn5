import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const Table = forwardRef(({ rowData, columnDefs, onCellValueChanged, onGridReady }, ref) => {
  const gridRef = useRef(null)

  useImperativeHandle(ref, () => ({
    refreshGrid: () => {
      if (gridRef.current && gridRef.current.api) {
        console.log('Forcing grid refresh')
        gridRef.current.api.setGridOption('rowData', rowData)
        gridRef.current.api.refreshCells({ force: true })
      }
    }
  }))

  const onGridReadyInternal = useCallback(
    (params) => {
      console.log('Grid ready event fired')
      if (onGridReady) onGridReady(params.api)
    },
    [onGridReady]
  )

  useEffect(() => {
    console.log('Table component rendered')
    console.log('rowData in Table:', rowData)
    console.log('columnDefs:', columnDefs)

    if (gridRef.current && gridRef.current.api) {
      console.log('Updating grid data in Table useEffect')
      gridRef.current.api.setGridOption('rowData', rowData)
      gridRef.current.api.refreshCells({ force: true })
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
})

export default Table
