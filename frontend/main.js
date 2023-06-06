const path = require('path')
const url = require('url')
const { app, BrowserWindow, ipcMain, session } = require('electron')

function createWindow () {
    
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      enableRemoteModule: true
    }

  })
  win.webContents.openDevTools()

  // This will load the React app
  win.loadURL(
    process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, './build/index.html'),
        protocol: 'file:',
        slashes: true

    })
  )
}

ipcMain.on('login', (event, { token, user_id, user_name }) => {
    const cookie = {
      url: 'http://localhost:8080',
      name: 'session_token',
      value: token,
      sameSite: 'lax',
      secure: false
    }
  
    session.defaultSession.cookies.set(cookie).then(() => {
      console.log('Cookie set', cookie)

          // Retrieve all cookies
    session.defaultSession.cookies.get({}).then((cookies) => {
        console.log(cookies)
      })
    }, (error) => {
      console.error('Failed to set cookie:', error)
    })
  })
  

app.on('ready', createWindow)