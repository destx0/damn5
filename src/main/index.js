// src/main/index.js

import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import * as XLSX from 'xlsx'
import { parse } from 'csv-parse/sync'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db

async function initializeDatabase() {
  db = await open({
    filename: 'students.sqlite',
    driver: sqlite3.Database
  })

  const tableInfo = await db.all("PRAGMA table_info('students')")

  if (tableInfo.length === 0) {
    await db.exec(`
      CREATE TABLE students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId TEXT UNIQUE,
        aadharNo TEXT,
        name TEXT,
        surname TEXT,
        fathersName TEXT,
        mothersName TEXT,
        religion TEXT,
        caste TEXT,
        subCaste TEXT,
        placeOfBirth TEXT,
        taluka TEXT,
        district TEXT,
        state TEXT,
        dateOfBirth TEXT,
        lastAttendedSchool TEXT,
        lastSchoolStandard TEXT,
        dateOfAdmission TEXT,
        admissionStandard TEXT,
        progress TEXT,
        conduct TEXT,
        dateOfLeaving TEXT,
        currentStandard TEXT,
        reasonOfLeaving TEXT,
        remarks TEXT,
        motherTongue TEXT,
        ten TEXT,
        grn TEXT,
        certGenCount INTEGER DEFAULT 0
      )
    `)
  } else {
    // Check if new columns exist, if not, add them
    const columns = tableInfo.map((col) => col.name)
    if (!columns.includes('motherTongue')) {
      await db.exec('ALTER TABLE students ADD COLUMN motherTongue TEXT')
    }
    if (!columns.includes('ten')) {
      await db.exec('ALTER TABLE students ADD COLUMN ten TEXT')
    }
    if (!columns.includes('grn')) {
      await db.exec('ALTER TABLE students ADD COLUMN grn TEXT')
    }
    if (!columns.includes('certGenCount')) {
      await db.exec('ALTER TABLE students ADD COLUMN certGenCount INTEGER DEFAULT 0')
    }

    const indexInfo = await db.all("PRAGMA index_list('students')")
    const studentIdIndex = indexInfo.find((index) => index.name === 'idx_studentId')

    if (!studentIdIndex) {
      await db.exec('CREATE UNIQUE INDEX idx_studentId ON students(studentId)')
    }
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function parseDate(value) {
  if (typeof value === 'number') {
    const utc_days = Math.floor(value - 25569)
    const utc_value = utc_days * 86400
    const date_info = new Date(utc_value * 1000)
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate())
  } else if (typeof value === 'string') {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date
    }
    const parts = value.split('/')
    if (parts.length === 3) {
      return new Date(parts[2], parts[1] - 1, parts[0])
    }
  }
  return null
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await initializeDatabase()

  ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'CSV Files', extensions: ['csv'] },
        { name: 'Excel Files', extensions: ['xlsx'] }
      ]
    })
    return result
  })

  ipcMain.handle('import-file-and-save', async () => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Spreadsheets', extensions: ['xlsx', 'xls', 'csv'] }]
      })

      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, reason: 'No file selected' }
      }

      const filePath = result.filePaths[0]
      console.log('Reading file:', filePath)

      let data
      if (filePath.endsWith('.csv')) {
        const fileContent = fs.readFileSync(filePath, 'utf8')
        data = parse(fileContent, { columns: true, skip_empty_lines: true })
      } else {
        const workbook = XLSX.readFile(filePath)
        const worksheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[worksheetName]
        data = XLSX.utils.sheet_to_json(worksheet)
      }

      await db.run('BEGIN TRANSACTION')
      for (const item of data) {
        const dateOfBirth = parseDate(item.dateOfBirth)
        const dateOfAdmission = parseDate(item.dateOfAdmission)
        const dateOfLeaving = parseDate(item.dateOfLeaving)

        await db.run(
          `
          INSERT OR REPLACE INTO students (
            studentId, aadharNo, name, surname, fathersName, mothersName,
            religion, caste, subCaste, placeOfBirth, taluka, district, state,
            dateOfBirth, lastAttendedSchool, lastSchoolStandard, dateOfAdmission,
            admissionStandard, progress, conduct, dateOfLeaving, currentStandard,
            reasonOfLeaving, remarks, motherTongue, ten, grn, certGenCount
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            item.studentId,
            item.aadharNo,
            item.name,
            item.surname,
            item.fathersName,
            item.mothersName,
            item.religion,
            item.caste,
            item.subCaste,
            item.placeOfBirth,
            item.taluka,
            item.district,
            item.state,
            dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null,
            item.lastAttendedSchool,
            item.lastSchoolStandard,
            dateOfAdmission ? dateOfAdmission.toISOString().split('T')[0] : null,
            item.admissionStandard,
            item.progress,
            item.conduct,
            dateOfLeaving ? dateOfLeaving.toISOString().split('T')[0] : null,
            item.currentStandard,
            item.reasonOfLeaving,
            item.remarks,
            item.motherTongue,
            item.ten,
            item.grn,
            item.certGenCount || 0
          ]
        )
      }
      await db.run('COMMIT')

      const students = await db.all('SELECT * FROM students')

      return { success: true, data: students }
    } catch (error) {
      await db.run('ROLLBACK')
      console.error('Error in import file and save:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('get-students', async () => {
    try {
      const students = await db.all('SELECT * FROM students')
      return { success: true, data: students }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('add-student', async (event, student) => {
    try {
      const result = await db.run(
        `
        INSERT OR REPLACE INTO students (
          studentId, aadharNo, name, surname, fathersName, mothersName,
          religion, caste, subCaste, placeOfBirth, taluka, district, state,
          dateOfBirth, lastAttendedSchool, lastSchoolStandard, dateOfAdmission,
          admissionStandard, progress, conduct, dateOfLeaving, currentStandard,
          reasonOfLeaving, remarks, motherTongue, ten, grn, certGenCount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          student.studentId,
          student.aadharNo,
          student.name,
          student.surname,
          student.fathersName,
          student.mothersName,
          student.religion,
          student.caste,
          student.subCaste,
          student.placeOfBirth,
          student.taluka,
          student.district,
          student.state,
          student.dateOfBirth,
          student.lastAttendedSchool,
          student.lastSchoolStandard,
          student.dateOfAdmission,
          student.admissionStandard,
          student.progress,
          student.conduct,
          student.dateOfLeaving,
          student.currentStandard,
          student.reasonOfLeaving,
          student.remarks,
          student.motherTongue,
          student.ten,
          student.grn,
          student.certGenCount
        ]
      )
      return { success: true, id: result.lastID }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
  // Add this handler in your main process file
  ipcMain.handle('generate-certificate', async (event, studentId) => {
    try {
      // First, get the current student data
      const [student] = await db.all('SELECT * FROM students WHERE studentId = ?', studentId)

      if (!student) {
        throw new Error('Student not found')
      }

      // Increment the certGenCount
      const newCertGenCount = (student.certGenCount || 0) + 1

      // Update the student record with the new certGenCount
      await db.run('UPDATE students SET certGenCount = ? WHERE studentId = ?', [
        newCertGenCount,
        studentId
      ])

      // Here, you would typically generate the certificate
      // For this example, we'll just return the updated student data
      const [updatedStudent] = await db.all('SELECT * FROM students WHERE studentId = ?', studentId)

      return { success: true, data: updatedStudent }
    } catch (error) {
      console.error('Error generating certificate:', error)
      return { success: false, error: error.message }
    }
  })
  
  ipcMain.handle('update-student', async (event, student) => {
    try {
      const result = await db.run(
        `
        UPDATE students SET
          aadharNo = ?, name = ?, surname = ?, fathersName = ?,
          mothersName = ?, religion = ?, caste = ?, subCaste = ?, placeOfBirth = ?,
          taluka = ?, district = ?, state = ?, dateOfBirth = ?, lastAttendedSchool = ?,
          lastSchoolStandard = ?, dateOfAdmission = ?, admissionStandard = ?,
          progress = ?, conduct = ?, dateOfLeaving = ?, currentStandard = ?,
          reasonOfLeaving = ?, remarks = ?, motherTongue = ?, ten = ?, grn = ?,
          certGenCount = ?
        WHERE studentId = ?
      `,
        [
          student.aadharNo,
          student.name,
          student.surname,
          student.fathersName,
          student.mothersName,
          student.religion,
          student.caste,
          student.subCaste,
          student.placeOfBirth,
          student.taluka,
          student.district,
          student.state,
          student.dateOfBirth,
          student.lastAttendedSchool,
          student.lastSchoolStandard,
          student.dateOfAdmission,
          student.admissionStandard,
          student.progress,
          student.conduct,
          student.dateOfLeaving,
          student.currentStandard,
          student.reasonOfLeaving,
          student.remarks,
          student.motherTongue,
          student.ten,
          student.grn,
          student.certGenCount,
          student.studentId
        ]
      )
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('delete-student', async (event, studentId) => {
    console.log(`Attempting to delete student with ID: ${studentId}`)
    try {
      await db.run('BEGIN TRANSACTION')
      const result = await db.run('DELETE FROM students WHERE studentId = ?', studentId)
      await db.run('COMMIT')

      console.log('Delete operation result:', result)

      if (result.changes === 0) {
        console.log(`No student found with ID: ${studentId}`)
        return { success: false, error: 'Student not found' }
      }

      console.log(`Successfully deleted student with ID: ${studentId}`)
      return { success: true, deletedRows: result.changes }
    } catch (error) {
      await db.run('ROLLBACK')
      console.error('Error in delete operation:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('save-file-dialog', async () => {
    try {
      const result = await dialog.showSaveDialog({
        filters: [{ name: 'CSV', extensions: ['csv'] }]
      })

      if (result.filePath) {
        const students = await db.all('SELECT * FROM students')
        const headers = Object.keys(students[0]).join(',')
        const csvContent = students.map((s) => Object.values(s).join(',')).join('\n')
        fs.writeFileSync(result.filePath, `${headers}\n${csvContent}`)
        return { success: true, filePath: result.filePath }
      }
      return { success: false, reason: 'No file path selected' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
