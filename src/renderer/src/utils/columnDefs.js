import generateCertificate from '../components/generateCertificate'

const columnDefs = [
  { field: 'id', editable: false },
  { field: 'name', editable: true },
  { field: 'grade', editable: true },
  {
    headerName: 'Actions',
    cellRenderer: (params) => {
      const button = document.createElement('button')
      button.innerText = 'Generate Certificate'
      button.addEventListener('click', () => generateCertificate(params.data))
      return button
    }
  }
]

export default columnDefs
