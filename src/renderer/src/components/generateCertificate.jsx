import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { toast } from 'sonner'

const generateCertificate = async (student) => {
  try {
    // Function to format date (assuming date is in ISO format)
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB') // DD/MM/YYYY format
    }

    // Create certificate HTML content with student data
    const certificateHTML = `
      <div id="certificate" style="width: 210mm; height: 297mm; padding: 20mm; box-sizing: border-box; background-color: white; font-family: Arial, sans-serif; border: 2px solid black; font-size: 12pt;">
        <h2 style="text-align: center; margin-bottom: 10px;">Jaggannath Shikshan Prasarak Mandal's</h2>
        <h1 style="text-align: center; margin-bottom: 5px;">Shashikant Sakharam Chaudhari Kanya Vidyalay, Yawal</h1>
        <h3 style="text-align: center; margin-bottom: 10px;">Taluka- Yawal, Dist. Jalgaon</h3>
        <p style="text-align: center; margin-bottom: 5px;">Phone No. 02585-261290 &nbsp;&nbsp;&nbsp;&nbsp; E Mail - mksyawal@yahoo.in</p>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Sr. No. 78</span>
          <span>G. Register No.</span>
        </div>
        <p style="margin-bottom: 5px;">School Reg. No.- Edu. Depu.Dir/Sec-2/First Appru/90-91/92/Div.Sec.Depu.Dir.Nashik/Datted 12-3-92</p>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>U Dise No.- 27031508414</span>
          <span>Board- Nashik</span>
          <span>Index No.- 15.15.005</span>
        </div>
        <h2 style="text-align: center; text-decoration: underline; margin-bottom: 20px;">Leaving Certificate</h2>
        <div style="line-height: 1.6; padding: 10px 0;">
          Student ID.: ${student.studentId} U.I.D. No. (Aadhar Card No.): ${student.aadharNo}<br>
          Name of the student in full (Name): ${student.name} (Father's Name): ${student.fathersName}<br>
          (Surname): ${student.surname}<br>
          Mother's Name: ${student.mothersName}<br>
          Nationality: Indian Mother tongue: ${student.motherTongue || '______________________'}<br>
          Religion: ${student.religion} Caste: ${student.caste} Sub-caste: ${student.subCaste}<br>
          Place of Birth: ${student.placeOfBirth} Taluka: ${student.taluka} Dist: ${student.district} State: ${student.state} Country: India<br>
          Date of Birth (DD/MM/YY): ${formatDate(student.dateOfBirth)}<br>
          Date of Birth (In words): ${student.dateOfBirthInWords || '______________________'}<br>
          Last school attended & standard: ${student.lastAttendedSchool} - ${student.lastSchoolStandard}<br>
          Date of admission in this school: ${formatDate(student.dateOfAdmission)} Standard: ${student.admissionStandard}<br>
          Progress: ${student.progress} Conduct: ${student.conduct}<br>
          Date of leaving school: ${formatDate(student.dateOfLeaving)}<br>
          Standard in which studying and since when (in words and figure): ${student.currentStandard}<br>
          Reason of leaving school: ${student.reasonOfLeaving}<br>
          Remarks: ${student.remarks}
        </div>
        <p style="margin-top: 20px;">Certified that the above information is in accordance with the School Register.</p>
        <div style="display: flex; justify-content: space-between; margin-top: 40px;">
          <div>Date: ${new Date().getDate()}</div>
          <div>Month: ${new Date().toLocaleString('default', { month: 'long' })}</div>
          <div>Year: ${new Date().getFullYear()}</div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 40px;">
          <div>Class Teacher</div>
          <div>Clerk</div>
          <div>Head Master<br>(Seal)</div>
        </div>
        <p style="font-size: 10pt; margin-top: 20px;">* No change in any entry in this certificate shall be made except by the authority issuing it.</p>
        <p style="font-size: 10pt;">* Any infringement of the rule is liable to be dealt with by rustication or by other suitable punishment.</p>
      </div>
    `

    // Create a new div to hold our certificate HTML
    const certificateContainer = document.createElement('div')
    certificateContainer.innerHTML = certificateHTML

    // Append to body temporarily (needed for html2canvas)
    document.body.appendChild(certificateContainer)

    // Use html2canvas to capture the certificate as an image
    const canvas = await html2canvas(certificateContainer.querySelector('#certificate'), {
      scale: 2, // Increase resolution
      width: 210 * 3.78, // A4 width in pixels (210mm * 3.78 pixels per mm)
      height: 297 * 3.78 // A4 height in pixels (297mm * 3.78 pixels per mm)
    })

    const imgData = canvas.toDataURL('image/jpeg', 1.0)

    // Create PDF (A4 size)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297)
    pdf.save(`${student.name}_${student.surname}_leaving_certificate.pdf`)

    // Remove the temporary div
    document.body.removeChild(certificateContainer)

    // Show success toast
    toast.success(
      'Certificate Generated',
      'The comprehensive A4 certificate has been generated and downloaded.'
    )
  } catch (error) {
    console.error('Error generating certificate:', error)
    // Show error toast
    toast.error('Error', 'There was an error generating the certificate. Please try again.')
    throw error // Rethrow the error to be caught by the caller
  }
}

export default generateCertificate
