// src/main/index.js
import { app, ipcMain, dialog, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import fs from 'fs'
import path from 'path'
import { createWindow } from './window'
import * as db from './database'

function registerIpcHandlers() {
  ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'CSV Files', extensions: ['csv'] },
        { name: 'Excel Files', extensions: ['xlsx', 'xls'] }
      ]
    })
    return result
  })

  ipcMain.handle('import-file-and-save', async (event, filePath) => {
    try {
      const students = await db.importStudents(filePath)
      return { success: true, data: students }
    } catch (error) {
      console.error('Error in import file and save:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('get-students', async () => {
    try {
      const students = await db.getStudents()
      return { success: true, data: students }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('add-student', async (event, student) => {
    try {
      const id = await db.addStudent(student)
      return { success: true, id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('update-student', async (event, student) => {
    try {
      await db.updateStudent(student)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('delete-student', async (event, studentId) => {
    try {
      const deletedRows = await db.deleteStudent(studentId)
      if (deletedRows === 0) {
        return { success: false, error: 'Student not found' }
      }
      return { success: true, deletedRows }
    } catch (error) {
      console.error('Error in delete operation:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('generate-certificate', async (event, studentId) => {
    try {
      const result = await db.generateCertificate(studentId)
      return { success: true, ...result }
    } catch (error) {
      console.error('Error generating certificate:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('save-file-dialog', async (event, content) => {
    try {
      const result = await dialog.showSaveDialog({
        filters: [{ name: 'CSV', extensions: ['csv'] }]
      })

      if (result.canceled) {
        return { success: false, reason: 'Export cancelled' }
      }

      if (result.filePath) {
        fs.writeFileSync(result.filePath, content)
        return { success: true, filePath: result.filePath }
      }
      return { success: false, reason: 'No file path selected' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
}

function setupAppEventListeners() {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  app.on('second-instance', () => {
    const mainWindow = BrowserWindow.getAllWindows()[0]
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

async function initializeApp() {
  await app.whenReady()

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await db.initializeDatabase()
  registerIpcHandlers()
  setupAppEventListeners()

  createWindow()
}

// This method will be called when Electron has finished initialization
// and is ready to create browser windows.
initializeApp().catch((error) => {
  console.error('Failed to initialize app:', error)
  app.quit()
})

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
