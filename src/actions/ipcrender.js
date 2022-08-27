const { channels } = require('../shared/constants');
const { ipcRenderer } = window.require('electron');
class Renderer {

  getLogData() {
    ipcRenderer.send(channels.RECEIVE_LOG, "Please");
    return new Promise((resolve, reject) => {
      ipcRenderer.on(channels.RECEIVE_LOG, (event, arg) => {
        // console.log(arg);
        resolve(arg);
      })
    })
  }
  getRequestData() {
    ipcRenderer.send(channels.RECEIVE_REQUEST_LOG, "OK");
    return new Promise((resolve, reject) => {
      ipcRenderer.on(channels.RECEIVE_REQUEST_LOG, (event, arg) => {
        resolve(arg);
      })
    })
  }

  getResponse() {
    ipcRenderer.send(channels.RECEIVE_RESPONSE_LOG, "OK");
    return new Promise((resolve, reject) => {
      ipcRenderer.on(channels.RECEIVE_RESPONSE_LOG, (event, arg) => {
        resolve(arg);
      })
    })
  }
  RequestLogPagination(page) {
    ipcRenderer.send(channels.RECEIVE_LOG_PAGINATION, page)
    return new Promise((resolve, reject) => {
      ipcRenderer.on(channels.RECEIVE_LOG_PAGINATION, (event, arg) => {
        resolve(arg);
      })
    })
  }
  receiveRequestPagination(page) {
    ipcRenderer.send(channels.RECEIVE_REQUEST_PAGINATION, page);
    return new Promise((resolve, reject) => {
      ipcRenderer.on(channels.RECEIVE_REQUEST_PAGINATION, (event, arg) => {
        resolve(arg);
      });
    });
  }
  receiveResponsePagination(page) {
    ipcRenderer.send(channels.RECEIVE_RESPONSE_PAGINATION, page);
    return new Promise((resolve, reject) => {
      ipcRenderer.on(channels.RECEIVE_RESPONSE_PAGINATION, (event, arg) => {
        resolve(arg)
      });
    })
  }

  receiveDateFilter(start, end) {
    var data = [start, end]
    ipcRenderer.send(channels.DATE_FILTER, data)
    return new Promise((resolve, reject) => {
      ipcRenderer.on(channels.DATE_FILTER, (event, arg) => {
        resolve(arg);
      })
    })
  }
  receiveDateLogPagination(start, end, page) {
    var data = [start, end, page]
    ipcRenderer.send(channels.DATE_LOG_PAGINATION, data)
    return new Promise((resolve, reject) => {
      ipcRenderer.on(channels.DATE_LOG_PAGINATION, (event, arg) => {
        resolve(arg);
      })
    })
  }
  receiveDateRequestPagination(start, end, page) {
    var data = [start, end, page]
    ipcRenderer.send(channels.DATE_REQUEST_PAGINATION, data)
    return new Promise((resolve, reject) => {
      ipcRenderer.on(channels.DATE_REQUEST_PAGINATION, (event, arg) => {
        resolve(arg);
      })
    })
  }
  receiveDateResponsePagination(start, end, page) {
    var data = [start, end, page]
    ipcRenderer.send(channels.DATE_RESPONSE_PAGINATION, data)
    return new Promise((resolve, reject) => {
      ipcRenderer.on(channels.DATE_RESPONSE_PAGINATION, (event, arg) => {
        resolve(arg);
      })
    })
  }
}

// module.exports = new Renderer();
export default new Renderer();
