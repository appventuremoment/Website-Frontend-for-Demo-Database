'use client';
import './styles.css';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAlert } from '@components/CustomAlert';

export default function Home() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { data: session, status } = useSession();

  // Handle Session ID rerouting
  useEffect(() => {
    if (status === 'loading') return; // Wait for auth token to load
    if (status === 'authenticated') router.push('/');
  }, [status, session, router])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {showAlert("Missing required fields"); return;}

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
  
    if (res.ok) {
      router.push('/');
    } else {
      showAlert('Invalid email or password')
    }
  };
  
  const [email, setEmailFieldText] = useState("");
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
      <form id='form' onSubmit={handleSubmit}>
        <b id='logo' style={{ userSelect: 'none' }}>Project DB</b>
        <p id='p-tag' style={{ top: '29.5%' }}>Email</p>
        <input id='input-field' type='email' value={email} onChange={(e) => setEmailFieldText(e.target.value)} style={{ top: "35%" }}></input>
        <p id='p-tag' style={{ top: '46%' }}>Password</p>
        <input id='input-field' type={type} value={password} onChange={(e) => setPWFieldText(e.target.value)} style={{ top: "51.5%", paddingRight: "7.5%" }}></input>
        <img src={icon} id='eye-icon' onClick={eyeIconHandleClick} onMouseEnter={handleIconMouseEnter} onMouseLeave={handleIconMouseLeave}></img>
        <div id='hyperlink-container'>
          <a id='hyperlink' href="/register">Register now</a>
          <a id='hyperlink' href="/forgot_password" style={{marginLeft: "auto"}}>Forgot password?</a>
        </div>
        <button id='login-button'>Login</button>
      </form>
    </div>
  );
}