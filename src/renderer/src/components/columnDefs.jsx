import { ActionCellRenderer } from './ActionCellRenderer'

export const columnDefs = [
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
]
