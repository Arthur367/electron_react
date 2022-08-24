const { channels } = require('../shared/constants');
const { ipcRenderer } = window.require('electron');
class Renderer {
  constructor() {
  }
  getLogData() {
    return new Promise((resolve, reject) => {
      ipcRenderer.once(channels.RECEIVE_LOG, (event, arg) => {
        // console.log(arg);
        resolve(arg);
      })
    })
  }
  getRequestData() {
    ipcRenderer.send(channels.RECEIVE_REQUEST_LOG, "OK");
    return new Promise((resolve, reject) => {
      ipcRenderer.once(channels.RECEIVE_REQUEST_LOG, (event, arg) => {
        resolve(arg);
      })
    })
  }

  getResponse() {
    ipcRenderer.send(channels.RECEIVE_RESPONSE_LOG, "OK");
    return new Promise((resolve, reject) => {
      ipcRenderer.once(channels.RECEIVE_RESPONSE_LOG, (event, arg) => {
        resolve(arg);
      })
    })
  }
}

module.exports = new Renderer();
