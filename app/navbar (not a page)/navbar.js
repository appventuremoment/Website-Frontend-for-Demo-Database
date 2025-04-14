'use client';
import "./navbar.css"
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

/* NavBar */
function NavItem(props) {
    const [open, setOpen] = useState(false);

    return (
        <li id="nav-item">
            <a id="icon-button" href={props.subdomain} onClick={() => setOpen(!open)}>
                <img id="icon-image" src={props.image} draggable="false" style={{userSelect: "none"}}/>
            </a>
            {open && React.isValidElement(props.children) && React.cloneElement(props.children, { closeDropdown: () => setOpen(false) })}

        </li>
    )
}

export default function NavBar(){
    return (
        <nav id="nav-bar" draggable={false}>
            <ul id="navbar-nav">
            <NavItem image="home_icon.png" subdomain='/'/>
            <b id='nav-logo'>Project DB</b>
            <NavItem image="add_icon.png" subdomain="add"/>
            <NavItem image="search_icon.png" subdomain="search"/>
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
          <div style={{ fontSize: '1.5vmin' }}>See my profile</div>
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