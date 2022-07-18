
import React, { Component, useState } from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { createUser, signMainUser } from '../axios';
import InputLicense from './input_license';
import { channels } from '../shared/constants';
import "./style.css";
const getmac = window.require('getmac');
const { ipcRenderer } = window.require('electron');


function MainPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState("");
  const [key, setKey] = useState("");
  var deviceId = getmac.default();

  const phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phone.match(phoneno)) {
      alert('Incorrect Phone Format');
    } else {

      const formData = {
        "fullName": fullName,
        "companyName": company,
        "contactPhone": phone,
        "email": email,
        "deviceId": "",
        "userNumbers": users,
        "deviceId": deviceId
      }
      createUser(formData).then((result) => {
        console.log(result.data);
        if (result.status === 201) {
          alert(result.data["message"]);
          navigate('/license');
        }
      }).catch((err) => {
        if (err.response.status === 400) {
          alert(err.response.data["message"])
        }

      });

    }
    alert(`FullName is ${fullName}`);

  }
  const licenseKeyActivation = (e) => {
    e.preventDefault();
    const formData = {
      "deviceID": deviceId,
      "key": key,
    }
    signMainUser(formData).then((result) => {
      console.log(result.data);
      if (result.status === 200) {
        alert(result.data["message"]);
        setKey("");
        ipcRenderer.send(channels.GET_DATA, "Successfull");
      }


    }).catch((err) => {
      console.log(err.response.status)
      if (err.response.status === 400) {
        alert(err.response.data["message"])
      }
    });
  }

  const signUpButtonClicked = (e) => {
    const container = document.getElementById('container');
    console.log(container)
    container.classList.add("right-panel-active");
    console.log(getmac.default())
  }
  const signInButtonClicked = (e) => {
    const container = document.getElementById('container');
    console.log(container)
    container.classList.remove("right-panel-active");

  }
  // const signUpButton = document.getElementById('signUp');
  // const signInButton = document.getElementById('signIn');
  // const container = document.getElementById('container');

  // signUpButton.addEventListener('click', () => {
  //   container.classNameList.add("right-panel-active");
  // });

  // signInButton.addEventListener('click', () => {
  //   container.classNameList.remove("right-panel-active");
  // });
  return (
    <div>
      <h1>Welcome To ESD</h1>
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form action="#" onSubmit={handleSubmit}>
            <h1>Create License</h1>
            <input type="text" required={true} value={fullName} onChange={(e) => { setFullName(e.target.value) }} placeholder="FullName" />
            <input type="text" placeholder="Company Name" value={company} required={true} onChange={(e) => setCompany(e.target.value)} />
            <input type="number" placeholder="Phone Number" value={phone} required={true} onChange={(e) => setPhone(e.target.value)} />
            <input type="email" placeholder="Email" value={email} required={true} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Number of Users" value={users} required={true} onChange={(e) => setUsers(e.target.value)} />
            <button type='submit'>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#" onSubmit={licenseKeyActivation}>
            <h1>Activate</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use another's license Key</span>
            <input type="text" value={key} required={true} onChange={(e) => setKey(e.target.value)} placeholder="LicenseKey" />
            <Link to="/subUser">Click to Use Anothers License Key</Link>
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" onClick={signInButtonClicked}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp" onClick={signUpButtonClicked}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default MainPage
