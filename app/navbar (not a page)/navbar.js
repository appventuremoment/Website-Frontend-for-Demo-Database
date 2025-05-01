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
    const navBarRef = useRef(null);
    
    useEffect(() => {
        let lastScroll = 0;
        const handleScroll = () => {
            const navBar = navBarRef.current;
            const currentScroll = window.scrollY;
            if (currentScroll <= 0) {
                navBar.classList.remove('scroll-up');
                navBar.classList.remove('scroll-down');
            } 
            else if (currentScroll > lastScroll) {
                navBar.classList.remove('scroll-up');
                navBar.classList.add('scroll-down');
            } 
            else if (currentScroll < lastScroll) {
                navBar.classList.add('scroll-up');
                navBar.classList.remove('scroll-down');
            }
            lastScroll = currentScroll;
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav id="nav-bar" draggable={false} ref={ navBarRef }>
            <ul id="navbar-nav">
            <NavItem image="/home_icon.png" subdomain='/'/>
            <b id='nav-logo'>Project DB</b>
            <NavItem image="/search_icon.png">
                <TempSearchDropdown/>
            </NavItem>
            <NavItem image="/menu_icon.png">
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
            <LoginDropdownItem leftIcon="/register_icon.png" subdomain={loginSubdomain}>{loginElem}</LoginDropdownItem>
            <hr style={{ border: "none", height: "0.05vmin", backgroundColor: "#505356", margin: "1vh auto"}}></hr>
            <DropdownItem leftIcon="/about_us_icon.png" subdomain="#about-us-div" closeDropdown={closeDropdown}>About Us</DropdownItem>
            <DropdownItem leftIcon="/contact_us_icon.png" subdomain="#contact-us-div" closeDropdown={closeDropdown}>Contact Us</DropdownItem>
            <DropdownItem leftIcon="/references_icon.png" subdomain="references">References</DropdownItem>
        </div>
    );
}

/* Temp Dropdown Menu */
function TempSearchDropdownItem(props){
    return(
        <a id="menu-item" href={props.subdomain} onClick={props.closeDropdown}>
            {props.children}
        </a>
    )
}

function TempSearchDropdown({closeDropdown}){
    const { data: session } = useSession();
    
    return(
        <div id="dropdown">
            <TempSearchDropdownItem subdomain={session?.user?.name ? '/search?table=student' : "/login"} closeDropdown={closeDropdown}>Students</TempSearchDropdownItem>
            <TempSearchDropdownItem subdomain={session?.user?.name ? '/search?table=project' : "/login"} closeDropdown={closeDropdown}>Projects</TempSearchDropdownItem>
            <TempSearchDropdownItem subdomain={session?.user?.name ? '/search?table=student_project' : "/login"} closeDropdown={closeDropdown}>Student Project Relations</TempSearchDropdownItem>
            <TempSearchDropdownItem subdomain={session?.user?.name ? '/search?table=ssef_project' : "/login"} closeDropdown={closeDropdown}>SSEF Projects</TempSearchDropdownItem>
            <TempSearchDropdownItem subdomain={session?.user?.name ? '/search?table=internal_mentor' : "/login"} closeDropdown={closeDropdown}>Internal Mentors</TempSearchDropdownItem>
            <TempSearchDropdownItem subdomain={session?.user?.name ? '/search?table=external_mentor' : "/login"} closeDropdown={closeDropdown}>External Mentors</TempSearchDropdownItem>
            <TempSearchDropdownItem subdomain={session?.user?.name ? '/search?table=external_company' : "/login"} closeDropdown={closeDropdown}>External Companies</TempSearchDropdownItem>
            <TempSearchDropdownItem subdomain={session?.user?.name ? '/search?table=publication' : "/login"} closeDropdown={closeDropdown}>Publications</TempSearchDropdownItem>
        </div>
    );
}