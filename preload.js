
const os = require('os')
const path = require('path')
const { contextBridge, ipcRenderer, webUtils } = require('electron')
const Toastify = require('toastify-js')

contextBridge.exposeInMainWorld('os', {
  homedir: ()=> os.homedir()
})

contextBridge.exposeInMainWorld('path', {
  join: (...args)=>path.join(...args)
}) 

contextBridge.exposeInMainWorld('Toastify', {
  toast: (options)=> Toastify(options).showToast()
})

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (chanel,data)=> ipcRenderer.send(chanel,data),
  on: (channel,func)=> ipcRenderer.on(channel,(event,...args)=>func(...args))
})

contextBridge. exposeInMainWorld("webUtils", {
getFilePath: (file) => webUtils. getPathForFile(file),
});


