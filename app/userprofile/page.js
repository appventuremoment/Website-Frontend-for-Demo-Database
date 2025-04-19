'use client'
import './styles.css';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react';
import { checkValidUserLength, checkValidPassword } from '@lib/datavalidation.ts';
import { useAlert } from '@components/CustomAlert';

export default function Home() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const { data: session, status, update } = useSession();

  // Handle Session ID rerouting
  useEffect(() => {
    if (status === 'loading') return; // Wait for auth token to load
    if (status !== 'authenticated') router.push('/');
  }, [status, session, router])
  
  // Change Display Name
  const nameInput = useRef(null);
  const saveChangesToUser = async () => {
    const nameChange = nameInput.current.value;
    const email = session.user.email;
    
    if (nameChange === '') setEditProfileOpen(false);
    else if (!checkValidUserLength(nameChange)){showAlert("Username must be between 3-40 characters")}
    else{
      const res = await fetch('/api/changename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username: nameChange }),
      });
      
      const data = await res.json()
      if (res.ok) {
        setEditProfileOpen(false);
        await update();
      } else showAlert(data.error);
    }
  };

  const oldPasswordInput = useRef(null);
  const newPasswordInput = useRef(null);
  const newPasswordConfirmInput = useRef(null);
  const [passwordCheckFail, setPasswordCheckFail] = useState("");
  const [passwordMatchFail, setPasswordMatchFail] = useState("");
  // Check if popup should display based on new password validity
  const handlePasswordCheck = () => {
    const newPassword = newPasswordInput.current.value;
    const confirmPassword = newPasswordConfirmInput.current.value;
    setPasswordMatchFail("");
    
    if (!checkValidPassword(newPassword)){
      if (newPassword.length < 8) setPasswordCheckFail("Password must be at least 8 characters long");
      else if (!/^(?=.*[a-z]).+$/.test(newPassword)) setPasswordCheckFail("Password must include at least 1 lowercase letter");
      else if (!/^(?=.*[A-Z]).+$/.test(newPassword)) setPasswordCheckFail("Password must include at least 1 uppercase letter");
      else if (!/^(?=.*\d).+$/.test(newPassword)) setPasswordCheckFail("Password must include at least 1 number");
      else setPasswordCheckFail("This alert should never be reached, if you see this please contact an administrator");
    }
    else{
      setPasswordCheckFail("");
      if (newPassword !== confirmPassword && confirmPassword !== '') setPasswordMatchFail("Passwords do not match");
    }
  }

  // Check if popup should display based on new passwords matching
  const handleSamePasswordCheck = () => {
    const newPassword = newPasswordInput.current.value;
    const confirmPassword = newPasswordConfirmInput.current.value;
    if (newPassword !== confirmPassword && !passwordCheckFail && confirmPassword !== '') setPasswordMatchFail("Passwords do not match");
    else setPasswordMatchFail("");
  }

  const handleChangePassword = async (e) => {
    const oldPassword = oldPasswordInput.current.value;
    const newPassword = newPasswordInput.current.value;
    const confirmPassword = newPasswordConfirmInput.current.value;

    
    if (!oldPassword || !newPassword || !confirmPassword) showAlert("Missing required fields");
    else if (!checkValidPassword(newPassword)){
      if (newPassword.length < 8) showAlert("Password must be at least 8 characters long");
      else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(newPassword)) showAlert("Password must include a number, an uppercase and a lowercase letter");
      else showAlert("This alert should never be reached, if you see this please contact an administrator");
    }
    else if (newPassword !== confirmPassword) {showAlert("Passwords do not match")}
    else if (oldPassword === newPassword) {showAlert("Password reset successful")}
    else {
      const res = await fetch('/api/changepassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, oldpassword: oldPassword, newpassword: newPassword }),
      })
      
      const data = await res.json()
      if (res.ok) {
        showAlert(data.message);
        signOut({ callbackUrl: "/login" });
      } else {
        showAlert(data.error);
      }
    }
  };
  
  
  // Change what is displayed under edit profile
  const editProfileElems = editProfileOpen ? (
    <div>
      <p id='profile-p' style={{ fontSize: "1.5vmin", paddingTop: '1vh' }} >Name</p>
      <input id='input' type='text' style={{ left: "2.5%", width: "95%" }} placeholder='Name' ref={ nameInput }/>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button id='save-cancel-button' style={{ border: "0.1vmin solid #39924b", backgroundColor: '#238636' }} onClick={ saveChangesToUser }>Save</button>
        <button id='save-cancel-button' style={{ border: "0.1vmin solid #3d444d", backgroundColor: '#212830', left: "0.4vmin"}} onClick={() => setEditProfileOpen(false) }>Cancel</button>
      </div>
    </div>
  ) : 
  <div>
    <b id='profile-p' style={{ paddingTop: '1vh', whiteSpace: "nowrap", overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '15vw', fontSize: "2vmin", display: 'inline-block' }}>{status === "loading" ? "Loading..." : session?.user?.name}</b>
    <p id='profile-p'>{status === "loading" ? "Loading..." : session?.user?.email}</p>
    <button id='edit-profile-button' onClick={() => setEditProfileOpen(true) }>Edit Profile</button>
  </div>

  return (
    <div id='outer-div' className='flex gap-10'>
      <div id='profile-page'>
        <img id='profile-icon' src='register_icon.png'></img>
        { editProfileElems }
      </div>
      <div id='settings'>
        <b style={{ fontSize: "3vmin" }}>Settings</b>

        <p style={{ fontSize: "2vmin" }}>Password</p>
        <hr id='line-break'></hr>
        <p style={{ fontSize: "1.5vmin" }}>Old password</p>
        <input id='input' type='password' style={{ width: "30%" }} ref={ oldPasswordInput }/>
        <p style={{ fontSize: "1.5vmin" }}>New password</p>
        <div style={{ position: "relative" }}>
          <input id='input' type="password" onChange={ handlePasswordCheck } ref={ newPasswordInput } style={{ width: "30%", border: (passwordCheckFail || passwordMatchFail) ? "0.1vmin solid red" : "0.1vmin solid #c4c4c4" }}/>
          {passwordCheckFail && ( <div id='error-popup'>{passwordCheckFail}</div> )}
        </div>
        <p style={{ fontSize: "1.5vmin" }}>Confirm new password</p>
        <div style={{ position: "relative" }}>
          <input id='input' type="password" onChange={ handleSamePasswordCheck } ref={ newPasswordConfirmInput } style={{ width: "30%", border: passwordMatchFail ? "0.1vmin solid red" : "0.1vmin solid #c4c4c4" }}/>
          {passwordMatchFail && ( <div id='error-popup'>{passwordMatchFail}</div> )}
        </div>
        <p style={{ marginTop: "1.5vmin", fontSize: "1vmin" }}>Make sure it's at least 8 characters including a number, an uppercase and a lowercase letter.</p>
        <button id='update-password-button' onClick={ handleChangePassword }>Update password</button>

        <p style={{ fontSize: "2vmin", marginTop: "2.5vmin" }}>Coming soon</p>
        <hr id='line-break'></hr>
        <p style={{ fontSize: "1.5vmin" }}>Coming soon</p>

        <button id='sign-out-button' style={{ top: '5vh'}} onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
      </div>
    </div>
  );
}