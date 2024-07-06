import React, { useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { MoreVertical, UserCircle, Printer, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const ActionCellRenderer = (params) => {
  const handleView = () => {
    console.log('View clicked for row:', params.data)
    // Add your view logic here
  }

  const handlePrint = () => {
    console.log('Print clicked for row:', params.data)
    // Add your print logic here
  }

  const handleDelete = () => {
    console.log('Delete clicked for row:', params.data)
    // Add your delete logic here
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <UserCircle className="mr-2 h-4 w-4 text-blue-500" />
          <span>View</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4 text-green-500" />
          <span>Print</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const AdvancedTable = ({ rowData }) => {
  const [columnDefs] = useState([
    {
      headerName: '',
      width: 50,
      cellRenderer: ActionCellRenderer,
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      sortable: false,
      filter: false,
      pinned: 'left'
    },
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
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
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
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
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
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      editable: true
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
    resizable: true,
    width: 110
  }

  const onCellValueChanged = useCallback((event) => {
    console.log('Cell value changed:', event)
    // Here you can add logic to update the database
  }, [])

  return (
    <div className="ag-theme-alpine w-full h-full text-sm">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
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
