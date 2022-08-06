import React, { useState } from 'react';
import { channels } from '../shared/constants';
const { ipcRenderer } = window.require('electron');
const Store = window.require('electron-store');
const store = new Store();

export default function Log() {
  const [logData, setLogData] = useState({});

  ipcRenderer.send(channels.LOG_DATA, "Log Data");
  ipcRenderer.on(channels.LOG_DATA, (event, arg) => {
    setLogData(`${arg}`)
    console.log(arg)
  })


  return (
    <div>{logData}</div>
  )
}