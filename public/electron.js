// ./public/electron.js

const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, } = require('electron');
const path = require('path');
const { app: express, server } = require('./server')
const isDev = require('electron-is-dev');
const os = require('os');
const fs = require("fs");
const { channels } = require('../src/shared/constants');

let win;
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

}
ipcMain.on(channels.GET_DATA, (event, arg) => {
  const product = arg;
  win.hide();
  console.log(product);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

const createTray = () => {
  const iconPath = path.join(__dirname, "./icon/icon.png")
  console.log(__dirname)
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 24, height: 24 })
  const tray = new Tray(trayIcon)
  const menuTemplate = [
    {
      label: null,
      enabled: false,
    },
    {
      label: 'Start Server',
      enabled: true,
      click: () => {
        server.listen(app.get('Port'), app.get('Host'), () => {
          menuTemplate[1].enabled = false
          menuTemplate[2].enabled = true
          buildTrayMenu(menuTemplate)
        })
      },

    },
    {
      label: 'Stop Server',
      enabled: false,
      click: () => {
        server.close(e => {
          console.log('Connection Closed', e)
          menuTemplate[1].enabled = true
          menuTemplate[2].enabled = false
          buildTrayMenu(menuTemplate)
        })
      }
    },
    {
      label: 'About',
      click: () => {
        dialog.showMessageBox({
          title: 'ESD',
          message: "ESD 1.03", //1.02
          detail: "Developed and Maintained",
          buttons: ['OK'],
          icon: "./icon/stop.png"
        })
      }
    },
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ]


  const buildTrayMenu = menu => {
    let lblStatus = "Inactive"
    let iconStatus = "./icon/stop.png"
    if (!menu[1].enabled) {
      lblStatus = "Active"
      iconStatus = "./icon/start.png"

    }

    const iconStatusPath = path.join(__dirname, iconStatus)

    menu[0].label = `"Service Status " ${lblStatus}`
    menu[0].icon = nativeImage.createFromPath(iconStatusPath).resize({ width: 24, height: 24 })

    const trayMenu = Menu.buildFromTemplate(menu)
    tray.setContextMenu(trayMenu)
  }

  buildTrayMenu(menuTemplate)
  server.listen(express.get('Port'), express.get('Host'), () => {
    menuTemplate[1].enabled = false
    menuTemplate[2].enabled = true
    buildTrayMenu(menuTemplate)
  })
}


app.once('ready', createTray)
app.whenReady().then(createWindow);



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bars to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.on('quit', () => {
  server.close()
})
