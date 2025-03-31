'use client';
import './styles.css';
import { useState } from 'react';

export default function Home() {
  const handleSubmit = () => {
    alert("Congrats, you have logged in! This goes no where for now..");
  }

  const [password, setPWFieldText] = useState("");
  const [type, setPWFieldType] = useState('password');
  const [icon, toggleIcon] = useState('eye_disabled_icon.png');

  const eyeIconHandleClick = () => {
    if (type==='password'){
       toggleIcon('eye_enabled_icon.png');
       setPWFieldType('text');
    } else {
       toggleIcon('eye_disabled_icon.png');
       setPWFieldType('password');
    }
  };

  const handleIconMouseEnter = () => {
    if (type === 'password') {
      toggleIcon('eye_enabled_icon.png');
    }
  };

  const handleIconMouseLeave = () => {
    if (type === 'password') {
      toggleIcon('eye_disabled_icon.png');
    }
  };
 

  return (
    <div id='background'>
      <form id='form' action="" type="GET">
        <b id='logo'>Project DB</b>
        <input id='input-field' type='email' placeholder='Enter email' style={{ top: "30%" }}></input>
        <input id='input-field' type={type} value={password} onChange={(e) => setPWFieldText(e.target.value)} placeholder='Enter password' style={{ top: "47.5%", paddingRight: "7.5%" }}></input>
        <img src={icon} id='eye-icon' onClick={eyeIconHandleClick} onMouseEnter={handleIconMouseEnter} onMouseLeave={handleIconMouseLeave}></img>
        <div id='hyperlink-container'>
          <a id='hyperlink' href="/register">Register now</a>
          <a id='hyperlink' href="/forgot_password" style={{marginLeft: "auto"}}>Forgot password?</a>
        </div>
        {/* TODO: change to onSubmit once functionalities in works */}
        <button id='login-button' onClick={handleSubmit}>Login</button>
      </form>
    </div>
  );
}