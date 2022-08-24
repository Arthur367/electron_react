import { useState } from 'react';
import { BrowserRouter, Route, Routes, Switch, Link } from 'react-router-dom';
import './App.css';
import SubUser from './pages/input_license';
import InputLicense from './pages/input_license';
import Log from './pages/log';
import MainPage from './pages/main_page';
import SubmitSubUserAccess from './pages/use_another';
import { channels } from './shared/constants';
const { ipcRenderer } = window.require('electron');

function App() {
  const [showLog, setShowLog] = useState('');
  // ipcMain.on(channels.GET_LOG, (event, arg) => {
  //   showLog = true;
  //   console.log(showLog);
  // })
  ipcRenderer.send(channels.GET_LOG, "Check Log");
  ipcRenderer.on(channels.GET_LOG, (event, arg) => {
    if (arg === "Ok") {
      setShowLog(true);
    } else {
      setShowLog(false);
    }
  })
  if (showLog) {
    ipcRenderer.send(channels.RECEIVE_LOG, "Please");
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Log />}></Route>
        </Routes>
      </BrowserRouter>
    )

  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={< MainPage />}></Route>
          <Route exact path='/license' element={< InputLicense />}></Route>
          <Route exact path="/subUser" element={<SubmitSubUserAccess />}></Route>
          <Route exact path="/log" element={<Log />}></Route>
        </Routes>
      </BrowserRouter>

    );
  }




}

export default App;
