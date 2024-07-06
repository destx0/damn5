import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const generateCertificate = (student) => {
  // Create a new div to hold our certificate HTML
  const certificateContainer = document.createElement('div')
  certificateContainer.innerHTML = `
    <div class="certificate">
        <h1>Certificate of Achievement</h1>
        <p>This is to certify that</p>
        <p class="student-name" id="studentName">${student.name}</p>
        <p>has successfully completed the course with grade</p>
        <p class="details" id="grade">${student.grade}</p>
        <p class="details" id="date">${new Date().toLocaleDateString()}</p>
        <p class="signature">Principal's Signature</p>
    </div>
  `

  // Apply styles
  const style = document.createElement('style')
  style.textContent = `
    .certificate {
        width: 800px;
        height: 600px;
        background-color: white;
        border: 2px solid #golden;
        padding: 20px;
        text-align: center;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        font-family: Arial, sans-serif;
    }
    h1 {
        color: #2c3e50;
        font-size: 36px;
        margin-bottom: 20px;
    }
    .student-name {
        font-size: 28px;
        color: #34495e;
        margin: 20px 0;
    }
    .details {
        font-size: 18px;
        color: #7f8c8d;
        margin: 20px 0;
    }
    .signature {
        margin-top: 50px;
        border-top: 1px solid #bdc3c7;
        padding-top: 10px;
        font-style: italic;
    }
  `

  certificateContainer.appendChild(style)

  // Append to body temporarily (needed for html2canvas)
  document.body.appendChild(certificateContainer)

  // Use html2canvas to capture the certificate as an image
  html2canvas(certificateContainer).then((canvas) => {
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    })

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`${student.name}_certificate.pdf`)

    // Remove the temporary div
    document.body.removeChild(certificateContainer)
  })
}

export default generateCertificate
