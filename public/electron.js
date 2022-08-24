// ./public/electron.js

const { app, BrowserWindow, Menu, dialog, Tray, nativeImage, ipcMain, Notification, ipcRenderer } = require('electron');
const path = require('path');
const { app: express, server } = require('./server')
const isDev = require('electron-is-dev');
const os = require('os');
const fs = require("fs");
const { channels } = require('../src/shared/constants');
const Store = require('electron-store');
const storedbdata = require('../src/storedbdata');
const store = new Store();
const fetch = require('electron-fetch').default
const shell = require('electron').shell



let win;
var isAppQuitting = false;
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

let logWindow;
function createLogWindow() {
  logWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  // logWindow.loadFile(path.join(__dirname, 'access/access.log'));
  logWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    logWindow.webContents.openDevTools({ mode: 'detach' });
  }
  logWindow.on('close', (event) => {
    if (app.quitting) {
      app.quit();
    } else {
      event.preventDefault()
      logWindow.hide()
    }
  });
}

app.on("before-quit", (event) => {
  isAppQuitting = true;
})

storedbdata.findRequest().then((docs) => {
  // console.log(docs)
  ipcMain.once(channels.RECEIVE_REQUEST_LOG, (event, arg) => {
    if (arg === "OK") {
      event.sender.send(channels.RECEIVE_REQUEST_LOG, docs);
    } else {
      ipcMain.removeAllListeners(channels.RECEIVE_REQUEST_LOG);
    }
  })
}).catch((err) => {
  console.log(err);
})
storedbdata.findResponse().then((docs) => {
  ipcMain.once(channels.RECEIVE_RESPONSE_LOG, (event, arg) => {
    if (arg === "OK") {
      event.sender.send(channels.RECEIVE_RESPONSE_LOG, docs);
    } else {
      ipcMain.removeAllListeners(channels.RECEIVE_RESPONSE_LOG);
    }
  })
}).catch((err) => {
  console.error(err);
})
storedbdata.findAll().then((docs) => {
  ipcMain.once(channels.RECEIVE_LOG, (event, arg) => {
    event.sender.send(channels.RECEIVE_LOG, docs);
  })
}).catch(err => console.log(err));

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let tray;
const createTray = () => {
  const iconPath = path.join(__dirname, "./icon/icon.png")
  console.log(__dirname)
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 24, height: 24 })
  tray = new Tray(trayIcon)
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
      label: 'Log',
      click: () => {
        // ipcRenderer.send(channels.GET_LOG, "open log");
        app.whenReady().then(createLogWindow);
        ipcMain.on(channels.GET_LOG, (event, arg) => {
          event.sender.send(channels.GET_LOG, "Ok");
        })

        // fs.readFileSync("Documents/esd_log.txt", "utf8");
        // fs.readFile(__dirname + '/access.log', "utf8", function (err, data) {
        //   if (err) return console.log(err);
        //   // data is the contents of the text file we just read
        // })
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
      label: 'Restart Service',
      click: () => {
        store.delete('key')
        ipcMain.on(channels.GET_LOG, (event, arg) => {
          event.sender.send(channels.GET_LOG, "Nope");
        })
        global.tray.destroy();
        createWindow();
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
// var log;
// fs.readFile(__dirname + '/log/access2.json', "utf8", function (err, data) {
//   if (err) return console.log(err);
//   // data is the contents of the text file we just read
//   console.log(data);
//   log = data;
//   return data;
// })
// ipcMain.on(channels.LOG_DATA, (event, arg) => {
//   event.sender.send(channels.LOG_DATA, log);
// })

// const { net } = require('electron')
// const request = net.request('http://localhost:8000/project/getUsers/')
// request.on('response', (response) => {
//   console.log(`STATUS: ${response.statusCode}`)
//   console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
//   response.on('data', (chunk) => {
//     console.log(`BODY: ${chunk}`)
//   })
//   response.on('end', () => {
//     console.log('No more data in response.')
//   })
// })
// request.end()
ipcMain.on(channels.GET_LICENSE, (event, arg) => {
  store.set('key', arg)
  console.log(store.get('key'))
})
app.whenReady().then(() => {
  var key = store.get('key') ?? " ";
  console.log(`key:${key}`);
  let body = '';
  var postData = JSON.stringify({ "key": key });

  const { net } = require('electron');
  const request = net.request({
    method: 'POST',
    url: "https://esd.netbotapp.com/project/getUsers/",
    headers: {
      'Content-Type': 'application/json',
    }
  })
  request.write(postData);
  request.on('response', (response) => {
    console.log(`STATUS: ${response.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    console.log(response.body)
    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
      body = JSON.parse(chunk.toString())
      app.whenReady().then(() => {
        if (body.message != "Activated") {
          const NOTIFICATION_TITLE = 'Basic Notification'
          const NOTIFICATION_BODY = body.message

          function showNotification() {
            new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
          }
          app.whenReady().then(showNotification).then(() => {
            setTimeout(createWindow, 3000)
            console.log(`version ${app.getVersion()}`);
          });
        } else {
          createTray();
          console.log(`version ${app.getVersion()}`);
        }
      })
      console.log(body.message);
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })

  request.end()

})

ipcMain.on('errorInWindow', (event, data) => {
  console.log(data);
})




ipcMain.on(channels.GET_DATA, (event, arg) => {
  const product = arg;
  win.hide();
  app.whenReady().then(createTray)
  console.log(product);
});





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
  console.log(`version${app.getVersion()}`);
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.on('quit', () => {
  server.close()
})
