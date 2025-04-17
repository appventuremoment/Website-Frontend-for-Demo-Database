'use client';
import './styles.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {
    const router = useRouter();
    const { data: session, status } = useSession();
  
    // Handle Session ID rerouting
    useEffect(() => {
      if (status === 'loading') return; // Wait for auth token to load
      if (status !== 'authenticated') router.push('/login');
    }, [status, session, router])

  return (
    <div id='background'>
      <b style={{ fontFamily: "Times New Roman", fontSize: "2.5vmax" }}>Error 404</b>
      <p style={{ fontSize: "1.5vmax" }}> There is nothing for you here. Come back when I have a project idea.. </p>
    </div>
  );
}