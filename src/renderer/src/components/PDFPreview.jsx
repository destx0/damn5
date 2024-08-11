import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from '@/components/ui/button'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const PDFPreview = ({ pdfPath, onGenerate, onClose }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-[210mm] h-[297mm] max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Certificate Preview</h2>
        <div className="flex-grow overflow-hidden">
          <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} width={550} />
          </Document>
        </div>
        <p className="text-center">
          Page {pageNumber} of {numPages}
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <Button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>
            Previous
          </Button>
          <Button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>
            Next
          </Button>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <Button onClick={onClose}>Close</Button>
          <Button onClick={onGenerate}>Save Certificate</Button>
        </div>
      </div>
    </div>
  )
}

export default PDFPreview
