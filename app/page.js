'use client';
import './styles.css'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [frontLogoPlacement, setFrontLogoPlacement] = useState('40%');
  const [frontLogoText, setFrontLogoText] = useState('Welcome to Project DB');
  const { data: session, status } = useSession();

  // Handle Session ID rerouting
  useEffect(() => {
    if (status === 'loading') return; // Wait for auth token to load
    if (status === 'authenticated'){
      setFrontLogoText(  <>
        <span>Hello {session.user.name}. Welcome to</span>
        <br/>
        <span>Project DB</span>
      </>
      );
      setFrontLogoPlacement("25%");
    }
  }, [status, session, router]);


  const trackRef = useRef(null);
  const div3Ref = useRef(null);
  const div3HeaderRef = useRef(null);

  useEffect(() => {
    // Handle Scrolling for Scrolling Pane
    const track = trackRef.current;
    const div3 = div3Ref.current;
    const div3Header = div3HeaderRef.current;
    const initialTrackTop = track.getBoundingClientRect().top - div3.getBoundingClientRect().top;
    const initialHeaderTop = div3Header.getBoundingClientRect().top - div3.getBoundingClientRect().top;
    
    const handleScroll = () => {
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      const trackLength = track.getBoundingClientRect().right - track.getBoundingClientRect().left;
      const distFromLeft = parseFloat(window.getComputedStyle(track).left);
      const divTop = div3.getBoundingClientRect().top;
      const divBottom = div3.getBoundingClientRect().bottom;
      const scrolledPos = Math.max(Math.min(divTop, 0), divTop - divBottom + viewportHeight);
      const lengthToScroll =  divTop - divBottom + viewportHeight;
      const scrollPercentage = -scrolledPos / lengthToScroll;
      const scrollDisplacement = scrollPercentage * (trackLength - viewportWidth + 2 * distFromLeft);
      
      track.dataset.percentage = scrollDisplacement;
      track.animate({
        transform: `translate(${ scrollDisplacement }px, 0%)`
      }, { duration: 1200, fill: "forwards"});
      for (const image of track.getElementsByClassName("image")) {
        image.animate({
          objectPosition: `${ scrollPercentage * 100 + 100 }% 50%`
        }, { duration: 1200, fill: "forwards"});
      }

      if (divTop <= 0 && divBottom >= viewportHeight){
        div3Header.style.position = "fixed";
        track.style.position = "fixed";
        div3Header.style.top = `${ initialHeaderTop }px`;
        track.style.top = `${ initialTrackTop }px`;
      }
      else {
        div3Header.style.position = "absolute";
        track.style.position = "absolute";
        div3Header.style.top = `${ initialHeaderTop - scrolledPos }px`;
        track.style.top = `${ initialTrackTop - scrolledPos }px`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);

    // Handle Fading In Transition
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
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
      window.removeEventListener('scroll', handleScroll);
      fadeInElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  function AutoResizeFont(minFontSize, maxFontSize) {
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
        fontSize = fontSize - 0.5;
        elem.style.fontSize = `${fontSize}vmin`;
      };
  
      resizeText();
      window.addEventListener('resize', resizeText);
      return () => window.removeEventListener('resize', resizeText);
    }, [minFontSize, maxFontSize]);
  
    return ref;
  }
  
  const textRef = AutoResizeFont(6, 12.5);
  return (
    <main>
      <div id='div-1'>
      <b id='front-logo' style={{ top: frontLogoPlacement }} ref={textRef} className='fade-in'>{frontLogoText}</b>
      <p id='tagline' className='fade-in'>We make tracking your projects easy</p>
      </div>
      
      <div id='about-us-div'>
        <b id='section-header' style={{right: '20%'}} className='fade-in'>Who are we?</b>
        <p id='section-subtext' style={{right: '7.5%'}} className='fade-in'>Originally focused on storing projects for NUS High, we are now expanding our platform to support schools nationwide, helping organizations manage and share projects more efficiently.</p>
        <img src='who_are_we.png' style={{left: '5%'}} id='info-image' className='fade-in'></img>
      </div>

      <div id='div-3' ref={ div3Ref }>
        <p id='div-3-header' className='fade-in' ref={ div3HeaderRef }>Projects in our database</p>
        <div id="image-track" draggable={false} ref={ trackRef }>
          <img className="image" src="imagetrack/img1.png" draggable="false"/>
          <img className="image" src="imagetrack/img2.png" draggable="false"/>
          <img className="image" src="imagetrack/img3.png" draggable="false"/>
          <img className="image" src="imagetrack/img4.png" draggable="false"/>
          <img className="image" src="imagetrack/img5.png" draggable="false"/>
          <img className="image" src="imagetrack/img6.png" draggable="false"/>
          <img className="image" src="imagetrack/img7.png" draggable="false"/>
          <img className="image" src="imagetrack/img8.png" draggable="false"/>
          <img className="image" src="imagetrack/img9.png" draggable="false"/>
          <img className="image" src="imagetrack/img10.png" draggable="false"/>
        </div>
      </div>

      <div id='div-4'>
        <img src='why_us.png' style={{right: '5%'}} id='info-image' className='fade-in'></img>
        <b id='section-header' style={{left: '17.5%'}} className='fade-in'>Why us?</b>
        <p id='section-subtext' style={{left: '6.5%'}} className='fade-in'>We have worked with over 100 different shelters. Our service is blazingly fast and memory-efficient: with no runtime or garbage collector, it can power performance-critical services, run on embedded devices, and easily integrate with other services.</p>
      </div>
      <div id="contact-us-div">
        <b id='contact-us-header' className='fade-in'>Contact Us</b>
        <img id='contact-us-icon' className='fade-in' style={{left: '25%', top: '40%'}} src='location_icon.png'></img>
        <p id='contact-us-details' className='fade-in' style={{left: '28.5%', top: '40%'}}>123 Someplace St., A City, ST 45678</p>
        <img id='contact-us-icon' className='fade-in'style={{right: '45%', top: '40%'}} src='phone_icon.png'></img>
        <p id='contact-us-details' className='fade-in' style={{left: '56%', top: '40%'}}>+123 4567 8900</p>
        <img id='contact-us-icon' className='fade-in' style={{left: '25%', top: '60%'}} src='email_icon.png'></img>
        <p id='contact-us-details' className='fade-in' style={{left: '28.5%', top: '60%'}}>test@testmail.com</p>
        <img id='contact-us-icon' className='fade-in' style={{right: '45%', top: '60%'}} src='website_icon.png'></img>
        <p id='contact-us-details' className='fade-in' style={{left: '56%', top: '60%'}}>projectdb.vercel.app</p>
      </div>
  </main>
  );
}