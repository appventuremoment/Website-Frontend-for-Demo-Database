'use client';
import "./navbar.css"
import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';

/* NavBar */
function NavItem(props) {
    const [open, setOpen] = useState(false);
    const navItemRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) { if (navItemRef.current && !navItemRef.current.contains(event.target)) setOpen(false); }
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleClickOutside);
        };
    }, [setOpen]);

    return (
        <li ref={navItemRef} id="nav-item">
            <a id="icon-button" href={props.subdomain} onClick={() => setOpen(!open)}>
                <img id="icon-image" src={props.image} draggable="false" style={{userSelect: "none"}}/>
            </a>
            {open && React.isValidElement(props.children) && React.cloneElement(props.children, { closeDropdown: () => setOpen(false) })}
        </li>
    )
}

export default function NavBar(){    
    const { data: session } = useSession();
    const addSubdomain = session?.user?.name ? '/add' : "/login"
    const searchSubdomain = session?.user?.name ? '/search' : "/login"
    
    useEffect(() => {
        let lastScroll = 0;
        const theNavBar = document.getElementById('nav-bar');
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll <= 0) {
                theNavBar.classList.remove('scroll-up');
                theNavBar.classList.remove('scroll-down');
            } 
            else if (currentScroll > lastScroll) {
                theNavBar.classList.remove('scroll-up');
                theNavBar.classList.add('scroll-down');
            } 
            else if (currentScroll < lastScroll) {
                theNavBar.classList.add('scroll-up');
                theNavBar.classList.remove('scroll-down');
            }
            lastScroll = currentScroll;
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav id="nav-bar" draggable={false}>
            <ul id="navbar-nav">
            <NavItem image="home_icon.png" subdomain='/'/>
            <b id='nav-logo'>Project DB</b>
            <NavItem image="add_icon.png" subdomain={ addSubdomain }/>
            <NavItem image="search_icon.png" subdomain={ searchSubdomain }/>
            <NavItem image="menu_icon.png">
                <DropdownMenu/>
            </NavItem>
            </ul>
        </nav>
    )
}


/* Dropdown Menu */
function DropdownItem(props){
    return(
        <a id="menu-item" href={props.subdomain} onClick={props.closeDropdown}>
            <img id="icon-button" src={props.leftIcon}></img>
            {props.children}
        </a>
    )
}

function LoginDropdownItem(props){
    return(
        <a id="login-item" href={props.subdomain}>
            <img id="icon-button" src={props.leftIcon}></img>
            {props.children}
        </a>
    )
}

function DropdownMenu({closeDropdown}){
    const { data: session } = useSession();
    const loginSubdomain = session?.user?.name ? '/userprofile' : "/login"

    const loginElem = session?.user?.name ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '11vmax'}}>{session.user.name}</div>
          <div style={{ fontSize: '1.5vmin' }}>See your profile</div>
        </div>
      ) : 'Login'

    return(
        <div id="dropdown">
            <LoginDropdownItem leftIcon="register_icon.png" subdomain={loginSubdomain}>{loginElem}</LoginDropdownItem>
            <hr style={{ border: "none", height: "0.05vmin", backgroundColor: "#505356", margin: "1vh auto"}}></hr>
            <DropdownItem leftIcon="about_us_icon.png" subdomain="/#about-us-div" closeDropdown={closeDropdown}>About Us</DropdownItem>
            <DropdownItem leftIcon="contact_us_icon.png" subdomain="/#contact-us-div" closeDropdown={closeDropdown}>Contact Us</DropdownItem>
            <DropdownItem leftIcon="references_icon.png" subdomain="references">References</DropdownItem>
        </div>
    );
}