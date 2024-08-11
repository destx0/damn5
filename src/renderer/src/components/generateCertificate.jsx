// src/renderer/src/utils/generateCertificate.js
import React from 'react'
import { createRoot } from 'react-dom/client'
import PDFPreview from '@/components/PDFPreview'
import { toast } from 'sonner'

const generateCertificate = async (student) => {
  try {
    const result = await window.api.generateCertificate(student.studentId)
    if (!result.success) {
      throw new Error(result.error)
    }
    const updatedStudent = result.data
    const tempPath = result.tempPath

    return new Promise((resolve, reject) => {
      const previewContainer = document.createElement('div')
      previewContainer.style.position = 'fixed'
      previewContainer.style.top = '0'
      previewContainer.style.left = '0'
      previewContainer.style.width = '100%'
      previewContainer.style.height = '100%'
      previewContainer.style.zIndex = '9999'
      document.body.appendChild(previewContainer)

      const root = createRoot(previewContainer)

      const cleanup = () => {
        root.unmount()
        document.body.removeChild(previewContainer)
      }

      root.render(
        <PDFPreview
          pdfPath={`file://${tempPath}`}
          onGenerate={async () => {
            try {
              const saveResult = await window.api.saveCertificate(
                tempPath,
                `${updatedStudent.name}_${updatedStudent.surname}`
              )
              if (saveResult.success) {
                const result = await window.api.updateCertificateCount(updatedStudent.studentId)
                if (!result.success) {
                  throw new Error(result.error)
                }
                toast.success(
                  'Certificate Generated',
                  `The comprehensive A4 certificate has been generated and saved. Certificate count: ${result.data.certGenCount}`
                )
                cleanup()
                resolve(result.data)
              } else {
                throw new Error(saveResult.reason || saveResult.error)
              }
            } catch (error) {
              cleanup()
              reject(error)
            }
          }}
          onClose={() => {
            cleanup()
            resolve(null)
          }}
        />
      )
    })
  } catch (error) {
    console.error('Error generating certificate:', error)
    toast.error('Error', 'There was an error generating the certificate. Please try again.')
    throw error
  }
}

export default generateCertificate
