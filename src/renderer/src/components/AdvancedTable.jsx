import React, { useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const AdvancedTable = ({ rowData }) => {
  const [columnDefs] = useState([
    {
      field: 'studentId',
      headerName: 'Student ID',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'name',
      headerName: 'Name',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'surname',
      headerName: 'Surname',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'dob',
      headerName: 'Date of Birth',
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      editable: true,
      cellEditor: 'agDateCellEditor'
    },
    {
      field: 'admissionStandard',
      headerName: 'Admission Standard',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'currentStandard',
      headerName: 'Current Standard',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'aadharNo',
      headerName: 'Aadhar No',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'fathersName',
      headerName: "Father's Name",
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'mothersName',
      headerName: "Mother's Name",
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'religion',
      headerName: 'Religion',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'caste',
      headerName: 'Caste',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'subCaste',
      headerName: 'Sub-Caste',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'placeOfBirth',
      headerName: 'Place of Birth',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'taluka',
      headerName: 'Taluka',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'district',
      headerName: 'District',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'state',
      headerName: 'State',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'lastAttendedSchool',
      headerName: 'Last Attended School',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'lastSchoolStandard',
      headerName: 'Last School Standard',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'dateOfAdmission',
      headerName: 'Date of Admission',
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      editable: true,
      cellEditor: 'agDateCellEditor'
    },
    {
      field: 'progress',
      headerName: 'Progress',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'conduct',
      headerName: 'Conduct',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'dateOfLeaving',
      headerName: 'Date of Leaving',
      filter: 'agDateColumnFilter',
      floatingFilter: true,
      editable: true,
      cellEditor: 'agDateCellEditor'
    },
    {
      field: 'reasonOfLeaving',
      headerName: 'Reason of Leaving',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
    }
  ])

  const defaultColDef = {
    sortable: true,
    resizable: true
  }

  const onCellValueChanged = useCallback((event) => {
    console.log('Cell value changed:', event)
    // Here you can add logic to update the database
  }, [])

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onCellValueChanged={onCellValueChanged}
        rowSelection={'multiple'}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
      />
    </div>
  )
}

export default AdvancedTable
