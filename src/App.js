import { useState } from 'react';
import { BrowserRouter, Route, Routes, Switch, Link } from 'react-router-dom';
import './App.css';
import SubUser from './pages/input_license';
import InputLicense from './pages/input_license';
import MainPage from './pages/main_page';
import SubmitSubUserAccess from './pages/use_another';

function App() {


  return (
    <BrowserRouter>


      <Routes>
        <Route exact path='/' element={< MainPage />}></Route>
        <Route exact path='/license' element={< InputLicense />}></Route>
        <Route exact path="/subUser" element={<SubmitSubUserAccess />}></Route>


      </Routes>

    </BrowserRouter>

  );
}

export default App;
