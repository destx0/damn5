import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const generateCertificate = async (student) => {
  try {
    // Fetch the HTML template
    const response = await fetch('/certificate-template.html')
    let htmlTemplate = await response.text()

    // Replace placeholders with actual data
    htmlTemplate = htmlTemplate.replace('{studentName}', `${student.name} ${student.surname}`)
    htmlTemplate = htmlTemplate.replace('{grade}', student.currentStandard)
    htmlTemplate = htmlTemplate.replace('{date}', new Date().toLocaleDateString())

    // Create a new div to hold our certificate HTML
    const certificateContainer = document.createElement('div')
    certificateContainer.innerHTML = htmlTemplate

    // Append to body temporarily (needed for html2canvas)
    document.body.appendChild(certificateContainer)

    // Use html2canvas to capture the certificate as an image
    const canvas = await html2canvas(certificateContainer.querySelector('.certificate'), {
      scale: 2, // Increase resolution
      width: 297 * 3.78, // A4 width in pixels (297mm * 3.78 pixels per mm)
      height: 210 * 3.78 // A4 height in pixels (210mm * 3.78 pixels per mm)
    })

    const imgData = canvas.toDataURL('image/jpeg', 1.0)

    // Create PDF (A4 size)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210)
    pdf.save(`${student.name}_${student.surname}_certificate.pdf`)

    // Remove the temporary div
    document.body.removeChild(certificateContainer)
  } catch (error) {
    console.error('Error generating certificate:', error)
    throw error // Rethrow the error to be caught by the caller
  }
}

export default generateCertificate
