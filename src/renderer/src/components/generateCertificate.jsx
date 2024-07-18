import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { toast } from 'sonner'

const generateCertificate = async (student) => {
  try {
    // Increment the certGenCount and get updated student data
    const result = await window.api.generateCertificate(student.studentId)
    if (!result.success) {
      throw new Error(result.error)
    }
    const updatedStudent = result.data

    // Function to format date (assuming date is in ISO format)
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB') // DD/MM/YYYY format
    }

    // Function to create an input-like field with specified size
    const createField = (value, size) => {
      const field = value || ''
      const padding = '&nbsp;'.repeat(Math.max(0, size - field.length))
      return `<span style="display: inline-block; position: relative; width: ${size}ch;">${field}${padding}<span style="position: absolute; bottom: -1px; left: 0; right: 0; border-bottom: 1px solid black;"></span></span>`
    }

    // Create certificate HTML content with updated student data
    const certificateHTML = `
      <div id="certificate" style="width: 210mm; height: 297mm; padding: 20mm 12mm; box-sizing: border-box; background-color: white; font-family: 'Times New Roman', Times, serif; border: 2px solid black; font-size: 13pt; position: relative; font-weight: 500;">
        <style>
          #certificate pre {
            line-height: 2; /* Increased line height for better spacing */
          }
        </style>
        <div style="position: absolute; top: 10mm; left: 10mm; right: 10mm; bottom: 10mm; border: 2px solid black;"></div>
        <h3 style="text-align: center;">Jaggannath Shikshan Prasarak Mandal's</h3>
        <h2 style="text-align: center; font-size: 23px;">Shashikant Sakharam Chaudhari Kanya Vidyalay, Yawal</h2>
        <h3 style="text-align: center;">Taluka- Yawal, Dist. Jalgaon</h3>
        <p style="text-align: center; margin-top: -10px; font-weight: normal;">Phone No. 02585-261290 &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; E Mail - mksyawal@yahoo.in</p>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Sr. No. 78</span>
          <span>G. Register No. ${createField(updatedStudent.grn, 15)}</span>
        </div>
        <pre style="font-family: inherit; font-size: inherit; margin: 0; white-space: pre-wrap; word-wrap: break-word;">School Reg. No.- Edu. Depu.Dir/Sec-2/First Appru/90-91/92/Div.Sec.Depu.Dir.Nashik/Datted 12-3-92</pre>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>U Dise No.- 27031508414</span>
          <span>Board- Nashik</span>
          <span>Index No.- 15.15.005</span>
        </div>
        <h2 style="text-align: center; text-decoration: underline; margin-bottom: 20px;">Leaving Certificate</h2>
        <pre style="line-height: 1.6; padding: 10px 0; font-family: inherit; font-size: inherit; margin: 0; white-space: pre-wrap; word-wrap: break-word;">
Student ID.: ${createField(updatedStudent.studentId, 25)} U.I.D. No. (Aadhar Card No.): ${createField(updatedStudent.aadharNo, 15)}
Name of the student in full (Name): ${createField(updatedStudent.name, 12)} (Father's Name): ${createField(updatedStudent.fathersName, 12)}
(Surname): ${createField(updatedStudent.surname, 20)}
Mother's Name: ${createField(updatedStudent.mothersName, 30)}
Nationality: ${createField(updatedStudent.nationality || 'Indian', 15)} Mother tongue: ${createField(updatedStudent.motherTongue, 29)}
Religion: ${createField(updatedStudent.religion, 10)} Caste: ${createField(updatedStudent.caste, 15)} Sub-caste: ${createField(updatedStudent.subCaste, 15)}
Place of Birth: ${createField(updatedStudent.placeOfBirth, 20)} Taluka: ${createField(updatedStudent.taluka, 25)} Dist: ${createField(updatedStudent.district, 25)} State: ${createField(updatedStudent.state, 20)} Country: India
Date of Birth (DD/MM/YY): according to the Christian era ${createField(formatDate(updatedStudent.dateOfBirth), 20)}
Date of Birth (In words): ${createField(updatedStudent.dateOfBirthInWords, 50)}
Last school attended & standard: ${createField(updatedStudent.lastAttendedSchool, 45)}
                                 ${createField(updatedStudent.lastSchoolStandard, 45)}
Date of admission in this school: ${createField(formatDate(updatedStudent.dateOfAdmission), 10)} Standard: ${createField(updatedStudent.admissionStandard, 20)}
Progress: ${createField(updatedStudent.progress, 25)} Conduct: ${createField(updatedStudent.conduct, 25)}
Date of leaving school: ${createField(formatDate(updatedStudent.dateOfLeaving), 10)}
Standard in which studying and since when (in words and figure): ${createField(updatedStudent.currentStandard, 30)}
Reason of leaving school: ${createField(updatedStudent.reasonOfLeaving, 30)}
Remarks: ${createField(updatedStudent.remarks, 50)}
        </pre>
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
        <pre style="font-size: 10pt; margin-top: 20px;">* No change in any entry in this certificate shall be made except by the authority issuing it.
* Any infringement of the rule is liable to be dealt with by rustication or by other suitable punishment.</pre>
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
    pdf.save(
      `${updatedStudent.name || 'Unnamed'}_${updatedStudent.surname || 'Student'}_leaving_certificate.pdf`
    )

    // Remove the temporary div
    document.body.removeChild(certificateContainer)

    // Show success toast
    toast.success(
      'Certificate Generated',
      `The comprehensive A4 certificate has been generated and downloaded. Certificate count: ${updatedStudent.certGenCount}`
    )

    return updatedStudent
  } catch (error) {
    console.error('Error generating certificate:', error)
    // Show error toast
    toast.error('Error', 'There was an error generating the certificate. Please try again.')
    throw error // Rethrow the error to be caught by the caller
  }
}

export default generateCertificate
