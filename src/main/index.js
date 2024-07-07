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

  // Check if the table exists
  const tableInfo = await db.all("PRAGMA table_info('students')")

  if (tableInfo.length === 0) {
    // If the table doesn't exist, create it with all fields and make studentId unique
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
        dob TEXT,
        lastAttendedSchool TEXT,
        lastSchoolStandard TEXT,
        dateOfAdmission TEXT,
        admissionStandard TEXT,
        progress TEXT,
        conduct TEXT,
        dateOfLeaving TEXT,
        currentStandard TEXT,
        reasonOfLeaving TEXT,
        remarks TEXT
      )
    `)
  } else {
    // If the table exists, check if studentId is unique
    const indexInfo = await db.all("PRAGMA index_list('students')")
    const studentIdIndex = indexInfo.find((index) => index.name === 'idx_studentId')

    if (!studentIdIndex) {
      // If studentId is not unique, add a unique constraint
      await db.exec('CREATE UNIQUE INDEX idx_studentId ON students(studentId)')
    }
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
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
    // Excel date serial number
    const utc_days = Math.floor(value - 25569)
    const utc_value = utc_days * 86400
    const date_info = new Date(utc_value * 1000)
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate())
  } else if (typeof value === 'string') {
    // Try parsing as ISO date string
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date
    }
    // If that fails, try DD/MM/YYYY format
    const parts = value.split('/')
    if (parts.length === 3) {
      return new Date(parts[2], parts[1] - 1, parts[0])
    }
  }
  // If all parsing attempts fail, return null
  return null
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await initializeDatabase()

  ipcMain.handle('import-file-and-save', async () => {
    console.log('Import file and save called')
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Spreadsheets', extensions: ['xlsx', 'xls', 'csv'] }]
      })
      console.log('Open file dialog result:', result)
      if (!result.canceled && result.filePaths.length > 0) {
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
        console.log('Parsed data:', data)

        await db.run('BEGIN TRANSACTION')
        for (const item of data) {
          // Parse date fields
          const dob = parseDate(item.dob)
          const dateOfAdmission = parseDate(item.dateOfAdmission)
          const dateOfLeaving = parseDate(item.dateOfLeaving)

          await db.run(
            `
            INSERT OR REPLACE INTO students (
              studentId, aadharNo, name, surname, fathersName, mothersName,
              religion, caste, subCaste, placeOfBirth, taluka, district, state,
              dob, lastAttendedSchool, lastSchoolStandard, dateOfAdmission,
              admissionStandard, progress, conduct, dateOfLeaving, currentStandard,
              reasonOfLeaving, remarks
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
              dob ? dob.toISOString().split('T')[0] : null,
              item.lastAttendedSchool,
              item.lastSchoolStandard,
              dateOfAdmission ? dateOfAdmission.toISOString().split('T')[0] : null,
              item.admissionStandard,
              item.progress,
              item.conduct,
              dateOfLeaving ? dateOfLeaving.toISOString().split('T')[0] : null,
              item.currentStandard,
              item.reasonOfLeaving,
              item.remarks
            ]
          )
        }
        await db.run('COMMIT')

        const students = await db.all('SELECT * FROM students')

        return { success: true, data: students }
      }
      return { success: false, reason: 'No file selected' }
    } catch (error) {
      console.error('Error in import file and save:', error)
      await db.run('ROLLBACK')
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('get-students', async () => {
    try {
      const students = await db.all('SELECT * FROM students')
      return { success: true, data: students }
    } catch (error) {
      console.error('Error fetching students:', error)
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
          dob, lastAttendedSchool, lastSchoolStandard, dateOfAdmission,
          admissionStandard, progress, conduct, dateOfLeaving, currentStandard,
          reasonOfLeaving, remarks
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          student.dob,
          student.lastAttendedSchool,
          student.lastSchoolStandard,
          student.dateOfAdmission,
          student.admissionStandard,
          student.progress,
          student.conduct,
          student.dateOfLeaving,
          student.currentStandard,
          student.reasonOfLeaving,
          student.remarks
        ]
      )
      return { success: true, id: result.lastID }
    } catch (error) {
      console.error('Error adding student:', error)
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
          taluka = ?, district = ?, state = ?, dob = ?, lastAttendedSchool = ?,
          lastSchoolStandard = ?, dateOfAdmission = ?, admissionStandard = ?,
          progress = ?, conduct = ?, dateOfLeaving = ?, currentStandard = ?,
          reasonOfLeaving = ?, remarks = ?
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
          student.dob,
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
          student.studentId
        ]
      )
      console.log('Student updated successfully:', student.studentId)
      return { success: true }
    } catch (error) {
      console.error('Error updating student:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('delete-student', async (event, studentId) => {
    try {
      await db.run('DELETE FROM students WHERE studentId = ?', studentId)
      console.log('Student deleted successfully:', studentId)
      return { success: true }
    } catch (error) {
      console.error('Error deleting student:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('save-file-dialog', async () => {
    console.log('Save file dialog called')
    try {
      const result = await dialog.showSaveDialog({
        filters: [{ name: 'CSV', extensions: ['csv'] }]
      })
      console.log('Save file dialog result:', result)
      if (result.filePath) {
        const students = await db.all('SELECT * FROM students')
        const headers = Object.keys(students[0]).join(',')
        const csvContent = students.map((s) => Object.values(s).join(',')).join('\n')
        fs.writeFileSync(result.filePath, `${headers}\n${csvContent}`)
        return { success: true, filePath: result.filePath }
      }
      return { success: false, reason: 'No file path selected' }
    } catch (error) {
      console.error('Error in save file dialog:', error)
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
