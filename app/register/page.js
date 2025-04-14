'use client';
import './styles.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession();

  // Handle Session ID rerouting
  useEffect(() => {
    if (status === 'loading') return; // Wait for auth token to load
    if (status === 'authenticated') router.push('/');
  }, [status, session, router])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password1 !== password2) return;
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: password1, username }),
    })
    

    const data = await res.json()

    if (res.ok) {
      alert(data.message)
      router.push('/login')
    } else {
      alert(data.error)
    }
  }

    const [username, setUsernameField1Text] = useState("");
    const [email, setEmailFieldText] = useState("");
    const [password1, setPWField1Text] = useState("");
    const [password2, setPWField2Text] = useState("");
    const [type1, setPWField1Type] = useState('password');
    const [type2, setPWField2Type] = useState('password');
    const [icon1, toggleIcon1] = useState('eye_disabled_icon.png');
    const [icon2, toggleIcon2] = useState('eye_disabled_icon.png');
  
    const eyeIcon1HandleClick = () => {
      if (type1==='password'){
         toggleIcon1('eye_enabled_icon.png');
         setPWField1Type('text')
      } else {
         toggleIcon1('eye_disabled_icon.png')
         setPWField1Type('password')
      }
   }

   const eyeIcon2HandleClick = () => {
    if (type2==='password'){
       toggleIcon2('eye_enabled_icon.png');
       setPWField2Type('text')
    } else {
       toggleIcon2('eye_disabled_icon.png')
       setPWField2Type('password')
    }
 }

 const handleIcon1MouseEnter = () => {
  if (type1 === 'password') {
    toggleIcon1('eye_enabled_icon.png');
  }
};

const handleIcon1MouseLeave = () => {
  if (type1 === 'password') {
    toggleIcon1('eye_disabled_icon.png');
  }
};

const handleIcon2MouseEnter = () => {
  if (type2 === 'password') {
    toggleIcon2('eye_enabled_icon.png');
  }
};

const handleIcon2MouseLeave = () => {
  if (type2 === 'password') {
    toggleIcon2('eye_disabled_icon.png');
  }
};


  return (
    <div id='background'>
      <form id='form' onSubmit={handleSubmit}>
        <div id='hyperlink-container'>
          <a id='hyperlink' href="/login">Back to Login Page</a>
        </div>
        <b id='logo'>Project DB</b>
        <input id='input-field' type='text' value={username} onChange={(e) => setUsernameField1Text(e.target.value)} placeholder='Enter username' style={{ top: "35%" }}></input>
        <input id='input-field' type='email' value={email} onChange={(e) => setEmailFieldText(e.target.value)} placeholder='Email' style={{ top: "46.5%" }}></input>
        <input id='input-field' type={type1} value={password1} onChange={(e) => setPWField1Text(e.target.value)} placeholder='Password' style={{ top: "58%", paddingRight: "7.5%" }}></input>
        <img src={icon1} id='eye-icon' onClick={eyeIcon1HandleClick} onMouseEnter={handleIcon1MouseEnter} onMouseLeave={handleIcon1MouseLeave} style={{ top: '58%' }}></img>
        <input id='input-field' type={type2} value={password2} onChange={(e) => setPWField2Text(e.target.value)} placeholder='Re-enter password' style={{ top: "69.5%", paddingRight: "7.5%" }}></input>
        <img src={icon2} id='eye-icon' onClick={eyeIcon2HandleClick} onMouseEnter={handleIcon2MouseEnter} onMouseLeave={handleIcon2MouseLeave} style={{ top: '69.5%' }}></img>
        <button id='register-button'>Register</button>
      </form>
    </div>
  );
}