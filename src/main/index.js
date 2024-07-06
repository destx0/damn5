import { app, BrowserWindow, ipcMain, dialog } from 'electron'
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

  await db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      grade TEXT
    )
  `)
}

function createWindow() {
  // Create the browser window.
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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await initializeDatabase()

  // IPC handler for importing Excel file and saving to database
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

        // Save to database
        await db.run('BEGIN TRANSACTION')
        for (const item of data) {
          await db.run('INSERT INTO students (name, grade) VALUES (?, ?)', [
            item.Name || item.name,
            item.Grade || item.grade
          ])
        }
        await db.run('COMMIT')

        // Fetch all students after insertion
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

  // Existing IPC handlers
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
      const result = await db.run('INSERT INTO students (name, grade) VALUES (?, ?)', [
        student.name,
        student.grade
      ])
      return { success: true, id: result.lastID }
    } catch (error) {
      console.error('Error adding student:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('update-student', async (event, student) => {
    try {
      await db.run('UPDATE students SET name = ?, grade = ? WHERE id = ?', [
        student.name,
        student.grade,
        student.id
      ])
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

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
