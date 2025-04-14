'use client'
import './styles.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react';
import { getRouteRegex } from 'next/dist/shared/lib/router/utils/route-regex';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Handle Session ID rerouting
  useEffect(() => {
    if (status === 'loading') return; // Wait for auth token to load
    if (status !== 'authenticated') router.push('/');
  }, [status, session, router])

  return (
    <div id='background'>
      <b style={{ fontFamily: "Times New Roman", fontSize: "2.5vmax" }}>My Profile</b>
      <p style={{ fontSize: "1.5vmax" }}>There is a lack of UI here because I am running out of time</p>
      <p style={{ fontSize: "1.5vmax" }}>Username: {status === "loading" ? "Loading..." : session?.user?.name}</p>
      <p style={{ fontSize: "1.5vmax" }}>Email: {status === "loading" ? "Loading..." : session?.user?.email}</p>
      <button style={{ backgroundColor: "#e0e0e0", padding: "6px 12px", border: "1px solid #ccc", borderRadius: "4px", color: "black", fontSize: "16px" }} onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
    </div>
  );
}