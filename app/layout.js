'use client'
import "./globals.css";
import { SessionProvider } from 'next-auth/react'
import NavBar from "./navbar (not a page)/navbar.js";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <SessionProvider>
        <main>
          <NavBar/>
          {children}
        </main>
        </SessionProvider>
      </body>
    </html>
  );
}
