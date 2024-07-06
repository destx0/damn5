import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  importExcelAndSave: () => ipcRenderer.invoke('import-excel-and-save'),
  saveFileDialog: (content) => ipcRenderer.invoke('save-file-dialog', content),
  getStudents: () => ipcRenderer.invoke('get-students'),
  addStudent: (student) => ipcRenderer.invoke('add-student', student),
  updateStudent: (student) => ipcRenderer.invoke('update-student', student),
  deleteStudent: (id) => ipcRenderer.invoke('delete-student', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
