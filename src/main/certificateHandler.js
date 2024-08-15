// src/main/certificateHandler.js
import { ipcMain } from 'electron'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import dateConverter from '@nexisltd/date2word'
import * as db from './database'

export function setupCertificateHandler() {
  ipcMain.handle('generate-certificate', async (event, studentId) => {
    try {
      const result = await generateCertificate(studentId)

      // Generate PDF
      const pdfBuffer = await generatePDF(result.data, result.serialNumber)

      return {
        success: true,
        data: result.data,
        pdfBase64: pdfBuffer.toString('base64'),
        serialNumber: result.serialNumber
      }
    } catch (error) {
      console.error('Error in generate-certificate:', error)
      return { success: false, error: error.message }
    }
  })
}

async function generateCertificate(studentId) {
  await db.run('BEGIN TRANSACTION')

  try {
    const [student] = await db.all('SELECT * FROM students WHERE studentId = ?', studentId)

    if (!student) {
      throw new Error('Student not found')
    }

    const newCertGenCount = (student.certGenCount || 0) + 1

    await db.run('UPDATE students SET certGenCount = ? WHERE studentId = ?', [
      newCertGenCount,
      studentId
    ])

    const { lastSerialNumber } = await db.get(
      'SELECT lastSerialNumber FROM certificate_counter WHERE id = 1'
    )
    const newSerialNumber = lastSerialNumber + 1

    await db.run(
      'UPDATE certificate_counter SET lastSerialNumber = ? WHERE id = 1',
      newSerialNumber
    )

    await db.run('INSERT INTO certificates (serialNumber, studentId) VALUES (?, ?)', [
      newSerialNumber,
      studentId
    ])

    await db.run('COMMIT')

    const [updatedStudent] = await db.all('SELECT * FROM students WHERE studentId = ?', studentId)

    return {
      data: updatedStudent,
      serialNumber: newSerialNumber
    }
  } catch (error) {
    await db.run('ROLLBACK')
    throw error
  }
}

async function generatePDF(student, serialNumber) {
  // Use the existing HTML template and PDF generation logic here
  // Return the PDF as a buffer
}
