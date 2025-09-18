const { create } = require('domain')
const { app, BrowserWindow, Menu, ipcMain, shell} = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')
const resizeImg = require('resize-img')
require('update-electron-app')({
  updateInterval: '1 hour',
});

process.env.NODE_ENV === 'development'
const isMacOS = process.platform === 'darwin'
const isDev = process.env.NODE_ENV === 'development'

app.disableHardwareAcceleration()

let mainWindow;
function createMainWindow () {
  mainWindow = new BrowserWindow({
    title: 'Image Resizer',
    width: isDev ? 1200:800,
    width: isDev ? 1200:800,
    height: isDev ? 800 : 600, 
    webPreferences: {
        contextIsolation:true,
        nodeIntegration:true,
        preload: path.join(__dirname, 'preload.js'),
    }
  })

  if(isDev)
  {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'))
}

function createAboutWindow () {
  const mainWindow = new BrowserWindow({
    title: 'About Image Resizer',
    width: isDev ? 1000 : 600,
    height: isDev ? 600 : 400, 
    
  })

  mainWindow.loadFile(path.join(__dirname, './renderer/about.html'))
}

app.whenReady().then(() => {
  createMainWindow()

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
  mainWindow.on('closed', ()=>(mainWindow = null))
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})
const menu = [
    {
        role: 'fileMenu'
    },
    {
        label: 'Help',
        submenu:[
            {
                label:'About', 
                click: createAboutWindow
            }
        ]
    }
]
ipcMain.on('image:resize', (e, options)=>{
    options.dest = path.join(process.cwd(),'resultResizeImage')
    resizeImage(options)
})

async function resizeImage({imgPath, width, height, dest})
{
    try {
        const newImage = await resizeImg(fs.readFileSync(imgPath), {width: +width, height:+height})

        const filename = path.basename(imgPath)
        if(!fs.existsSync(dest))
        {
            fs.mkdirSync(dest)
        }

        fs.writeFileSync(path.join(dest,filename),newImage)

        mainWindow.webContents.send('image:done')
        shell.openPath(dest)
    } catch (error) {
        console.log(error)
    }
}

app.on("window-all-closed", () => {
  if (isMacOS !== 'darwin') {
    app.quit();
  }
});