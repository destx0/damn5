import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import * as XLSX from 'xlsx'
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
    // If the table doesn't exist, create it with all fields
    await db.exec(`
      CREATE TABLE students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId TEXT,
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
    // If the table exists, check for missing columns and add them
    const existingColumns = tableInfo.map((column) => column.name)
    const allColumns = [
      'studentId',
      'aadharNo',
      'name',
      'surname',
      'fathersName',
      'mothersName',
      'religion',
      'caste',
      'subCaste',
      'placeOfBirth',
      'taluka',
      'district',
      'state',
      'dob',
      'lastAttendedSchool',
      'lastSchoolStandard',
      'dateOfAdmission',
      'admissionStandard',
      'progress',
      'conduct',
      'dateOfLeaving',
      'currentStandard',
      'reasonOfLeaving',
      'remarks'
    ]

    for (const column of allColumns) {
      if (!existingColumns.includes(column)) {
        await db.exec(`ALTER TABLE students ADD COLUMN ${column} TEXT`)
      }
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

function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569)
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)
  return date_info.toISOString().split('T')[0] // Returns YYYY-MM-DD
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await initializeDatabase()

  ipcMain.handle('import-excel-and-save', async () => {
    console.log('Import Excel and save called')
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
      })
      console.log('Open file dialog result:', result)
      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0]
        console.log('Reading file:', filePath)
        const workbook = XLSX.readFile(filePath)
        console.log('Workbook read successfully')
        const worksheetName = workbook.SheetNames[0]
        console.log('First worksheet name:', worksheetName)
        const worksheet = workbook.Sheets[worksheetName]
        const data = XLSX.utils.sheet_to_json(worksheet)
        console.log('Parsed data:', data)

        await db.run('BEGIN TRANSACTION')
        for (const item of data) {
          // Convert date fields
          if (item.dob) item.dob = excelDateToJSDate(item.dob)
          if (item.dateOfAdmission) item.dateOfAdmission = excelDateToJSDate(item.dateOfAdmission)
          if (item.dateOfLeaving) item.dateOfLeaving = excelDateToJSDate(item.dateOfLeaving)

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
              item.dob,
              item.lastAttendedSchool,
              item.lastSchoolStandard,
              item.dateOfAdmission,
              item.admissionStandard,
              item.progress,
              item.conduct,
              item.dateOfLeaving,
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
      console.error('Error in import Excel and save:', error)
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
      await db.run(
        `
        UPDATE students SET
          studentId = ?, aadharNo = ?, name = ?, surname = ?, fathersName = ?,
          mothersName = ?, religion = ?, caste = ?, subCaste = ?, placeOfBirth = ?,
          taluka = ?, district = ?, state = ?, dob = ?, lastAttendedSchool = ?,
          lastSchoolStandard = ?, dateOfAdmission = ?, admissionStandard = ?,
          progress = ?, conduct = ?, dateOfLeaving = ?, currentStandard = ?,
          reasonOfLeaving = ?, remarks = ?
        WHERE id = ?
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
          student.remarks,
          student.id
        ]
      )
      return { success: true }
    } catch (error) {
      console.error('Error updating student:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('delete-student', async (event, id) => {
    try {
      await db.run('DELETE FROM students WHERE id = ?', id)
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
