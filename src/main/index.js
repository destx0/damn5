// src/main/index.js

import { app, ipcMain, dialog } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import fs from 'fs'
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

  ipcMain.handle('generate-certificate', async (event, studentId) => {
    try {
      const result = await db.generateCertificate(studentId)
      return { success: true, ...result }
    } catch (error) {
      console.error('Error generating certificate:', error)
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

  ipcMain.handle('save-file-dialog', async () => {
    try {
      const result = await dialog.showSaveDialog({
        filters: [{ name: 'CSV', extensions: ['csv'] }]
      })

      if (result.filePath) {
        const students = await db.getStudents()
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
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await db.initializeDatabase()
  registerIpcHandlers()

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
