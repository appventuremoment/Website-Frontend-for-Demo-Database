'use client';
import './styles.css'
import { useEffect, useRef } from "react";

export function AutoResizeFont(minFontSize, maxFontSize) {
  const ref = useRef(null);

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return;

    const resizeText = () => {
      const container = elem.parentElement;
      if (!container) return;

      let fontSize = maxFontSize;
      elem.style.fontSize = `${fontSize}vmin`;

      while (elem.scrollWidth > container.offsetWidth && fontSize > minFontSize) {
        fontSize = fontSize - 0.1;
        elem.style.fontSize = `${fontSize}vmin`;
      }
    };

    resizeText();
    window.addEventListener('resize', resizeText);
    return () => window.removeEventListener('resize', resizeText);
  }, [minFontSize, maxFontSize]);

  return ref;
}

export default function Home() {
  useEffect(() => {
    // Handle Scrolling for Scrolling Pane
    const track = document.getElementById("image-track");
    const maxShift = -50;
    
    const handleScroll = () => {
      const scrolledPos = Math.max(track.getBoundingClientRect().top, 0);
      const Q1Q3 = window.innerHeight / 5;
      const lengthToScroll = window.innerHeight / 2;
      const scrollPercentage = (1 - (Math.max(Math.min(scrolledPos - Q1Q3, lengthToScroll), 0) / lengthToScroll)) * maxShift;
      track.dataset.percentage = scrollPercentage;

      
      track.animate({
        transform: `translate(${scrollPercentage}%, -40%)`
      }, { duration: 1800, fill: "forwards"});
      for (const image of track.getElementsByClassName("image")) {
        image.animate({
          objectPosition: `${scrollPercentage / maxShift * -100 + 100}% 50%`
        }, { duration: 1800, fill: "forwards"});
      }
    };

    window.onscroll = handleScroll;


    // Handle Fading In Transition
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeInElements.forEach((el) => observer.observe(el));
    
    return () => {
      window.onscroll = null;
      fadeInElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const textRef = AutoResizeFont(6, 12.5);
  return (
    <main>
      <div id='div-1'>
      <b id='front-logo' ref={textRef} className='fade-in'>Welcome to Project DB</b>
      <p id='tagline' className='fade-in'>We make tracking your projects easy</p>
      </div>

      <div id='div-2'>
        <p id='div-2-header' className='fade-in'>Projects in our database</p>
        <div id="image-track" draggable={false}>
          <img className="image" src="imagetrack/img1.png" draggable="false"/>
          <img className="image" src="imagetrack/img2.png" draggable="false"/>
          <img className="image" src="imagetrack/img3.png" draggable="false"/>
          <img className="image" src="imagetrack/img4.png" draggable="false"/>
          <img className="image" src="imagetrack/img5.png" draggable="false"/>
        </div>
      </div>
      
      <div id='about-us-div'>
        <b id='section-header' style={{right: '20%'}} className='fade-in'>Who are we?</b>
        <p id='section-subtext' style={{right: '7.5%'}} className='fade-in'>Originally focused on storing projects for NUS High, we are now expanding our platform to support schools nationwide, helping organizations manage and share projects more efficiently.</p>
        <img src='who_are_we.png' style={{left: '5%'}} id='info-image' className='fade-in'></img>
      </div>
      <div id='div-4'>
        <img src='why_us.png' style={{right: '5%'}} id='info-image' className='fade-in'></img>
        <b id='section-header' style={{left: '17.5%'}} className='fade-in'>Why us?</b>
        <p id='section-subtext' style={{left: '6.5%'}} className='fade-in'>We have worked with over 100 different shelters. Our service is blazingly fast and memory-efficient: with no runtime or garbage collector, it can power performance-critical services, run on embedded devices, and easily integrate with other services.</p>
      </div>
      <div id="contact-us-div">
        <b id='contact-us-header' className='fade-in'>Contact Us</b>
        <img id='contact-us-icon' className='fade-in' style={{left: '25%', top: '40%'}} src='location_icon.png'></img>
        <p id='contact-us-details' className='fade-in' style={{left: '28.5%', top: '40%'}}>123 Anywhere St., Any City, ST 12345</p>
        <img id='contact-us-icon' className='fade-in'style={{right: '45%', top: '40%'}} src='phone_icon.png'></img>
        <p id='contact-us-details' className='fade-in' style={{left: '56%', top: '40%'}}>123-456-7890</p>
        <img id='contact-us-icon' className='fade-in' style={{left: '25%', top: '60%'}} src='email_icon.png'></img>
        <p id='contact-us-details' className='fade-in' style={{left: '28.5%', top: '60%'}}>this_is_a_real_email@realmail.com</p>
        <img id='contact-us-icon' className='fade-in' style={{right: '45%', top: '60%'}} src='website_icon.png'></img>
        <p id='contact-us-details' className='fade-in' style={{left: '56%', top: '60%'}}>projectdb.vercel.app</p>
      </div>
  </main>
  );
}