import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import dateConverter from '@nexisltd/date2word'

let leaveCertificateNumber = 1000
let bonafideCertificateNumber = 2000

export const getNextLeaveCertificateNumber = () => {
  return leaveCertificateNumber++
}

export const getNextBonafideCertificateNumber = () => {
  return bonafideCertificateNumber++
}

export const generateCertificate = async (student, type, isDraft = true) => {
  const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>')
  const { document } = window

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB')
  }

  const createField = (label, value, size) => {
    const field = value || ''
    const padding = '&nbsp;'.repeat(Math.max(0, size - field.length))
    return `<strong>${label}:</strong> <span style="display: inline-block; position: relative; width: ${size}ch;">${field}${padding}<span style="position: absolute; bottom: -5px; left: 0; right: 0; border-bottom: 1px solid black;"></span></span>`
  }

  const dateOfBirthInWords = dateConverter(new Date(student.dateOfBirth), {
    isCapitalized: true,
    isDateFirst: true
  })

  const serialNumber =
    type === 'leave' ? getNextLeaveCertificateNumber() : getNextBonafideCertificateNumber()

  const certificateHTML = `
    <div id="certificate" style="width: 210mm; height: 297mm; padding: 20mm 12mm; box-sizing: border-box; background-color: white; font-family: 'Times New Roman', Times, serif; border: 2px solid black; font-size: 12pt; position: relative;">
      <style>
        #certificate pre {
          line-height: 2;
        }
        #certificate strong {
          font-weight: 700;
        }
      </style>
      <div style="position: absolute; top: 10mm; left: 10mm; right: 10mm; bottom: 10mm; border: 2px solid black;"></div>
      <h3 style="text-align: center; font-weight: bold; margin-top: -40px; margin-bottom: -6x;">Jaggannath Shikshan Prasarak Mandal's</h3>
      <h2 style="text-align: center; font-size: 23px; font-weight: bold;  margin-bottom: -6px;">Shashikant Sakharam Chaudhari Kanya Vidyalay, Yawal</h2>
      <h3 style="text-align: center; font-weight: bold; margin-top: 0;">Taluka- Yawal, Dist. Jalgaon</h3>
      <p style="text-align: center; margin-top: -6px;">Phone No. 02585-261290 &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; E Mail - mksyawal@yahoo.in</p>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0px;">
        <span><strong>Sr. No.</strong> ${createField('', isDraft ? 'DRAFT' : serialNumber.toString(), 8)}</span>
        <span><strong>G. Register No.</strong> ${createField('', student.grn, 6)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0px;">
        <span><strong>School Reg. No.</strong>- Edu. Depu.Dir/Sec-2/First Appru/</span>
        <span><strong>TEN:</strong> ${createField('', student.ten, 15)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0px;">
        <span style="padding-left: 7.5em;">90-91/92/Div.Sec.Depu.Dir.Nashik/Datted 12-3-92</span>
        <span><strong>Medium:</strong> Marathi</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: -10px;">
        <span><strong>U Dise No.</strong>- 27031508414</span>
        <span><strong>Board</strong>- Nashik</span>
        <span><strong>Index No.</strong>- 15.15.005</span>
      </div>
      <div style="text-align: center; margin-bottom: 0px;">
        <span style="font-size: 36px; font-weight: bold; text-decoration: underline;">${type === 'leave' ? 'Leaving Certificate' : 'Bonafide Certificate'}</span>
      </div>
      <pre style="line-height: 1.6; padding: 10px 0; font-family: inherit; font-size: inherit; margin: 0; white-space: pre-wrap; word-wrap: break-word;">
${createField('Student ID', student.studentId, 25)} ${createField('U.I.D. No. (Aadhar Card No.)', student.aadharNo, 24)}
<strong>Name of the student in full</strong> ${createField('(Name)', student.name, 20)} ${createField("(Father's Name)", student.fathersName, 20)}
                                        ${createField('(Surname)', student.surname, 30)}
${createField("Mother's Name", student.mothersName, 40)}
${createField('Nationality', student.nationality || 'Indian', 20)} ${createField('Mother tongue', student.motherTongue, 40)}
${createField('Religion', student.religion, 15)} ${createField('Caste', student.caste, 20)} ${createField('Sub-caste', student.subCaste, 25)}
${createField('Place of Birth', student.placeOfBirth, 10)} ${createField('Taluka', student.taluka, 10)} ${createField('Dist', student.district, 10)} ${createField('State', student.state, 12)} <strong>Country:</strong> India
${createField('Date of Birth (DD/MM/YY) according to the Christian era', formatDate(student.dateOfBirth), 34)}
${createField('Date of Birth (In words)', dateOfBirthInWords, 64)}
<strong>Last school attended & standard:</strong>${createField('', student.lastAttendedSchool, 55)}
${createField('', student.lastSchoolStandard, 85)}
${createField('Date of admission in this school', formatDate(student.dateOfAdmission), 24)} ${createField('Standard', student.admissionStandard, 25)}
${createField('Progress', student.progress, 33)} ${createField('Conduct', student.conduct, 35)}
${createField('Date of leaving school', formatDate(student.dateOfLeaving), 65)}
${createField('Standard in which studying and since when (in words and figure)', student.currentStandard, 85)}
${createField('Reason of leaving school', student.reasonOfLeaving, 64)}
${createField('Remarks', student.remarks, 78)}
      </pre>
      <p style="margin-top: -30px;  font-weight: bold;">Certified that the above information is in accordance with the School Register.</p>
      <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div><strong>Date:</strong> ${new Date().getDate()}</div>
        <div><strong>Month:</strong> ${new Date().toLocaleString('default', { month: 'long' })}</div>
        <div><strong>Year:</strong> ${new Date().getFullYear()}</div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div><strong>Class Teacher</strong></div>
        <div><strong>Clerk</strong></div>
        <div><strong>Head Master</strong><br>(Seal)</div>
      </div>
      <pre style="font-size: 10pt; margin-top: 20px;">* No change in any entry in this certificate shall be made except by the authority issuing it.
* Any infringement of the rule is liable to be dealt with by rustication or by other suitable
punishment.</pre>
    </div>
  `

  const container = document.createElement('div')
  container.innerHTML = certificateHTML
  document.body.appendChild(container)

  const canvas = await html2canvas(container, {
    scale: 2,
    width: 210 * 3.78,
    height: 297 * 3.78
  })

  const imgData = canvas.toDataURL('image/jpeg', 1.0)

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297)

  if (isDraft) {
    pdf.setFontSize(40)
    pdf.setTextColor(200, 200, 200)
    pdf.text('DRAFT', 105, 150, { align: 'center', angle: 45 })
  }

  return pdf.output('arraybuffer')
}
