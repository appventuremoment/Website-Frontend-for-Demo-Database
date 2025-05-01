'use client';
import './styles.css'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
  
    // Handle Session ID rerouting
    useEffect(() => {
        router.push('/');
    }, [router])

  return (
    <div id='background'>
      <b style={{ fontFamily: "Times New Roman", fontSize: "2.5vmax" }}>Error 404</b>
      <p style={{ fontSize: "1.5vmax" }}>You should not be here.</p>
    </div>
  );
}