'use client'
import "./globals.css";
import { SessionProvider } from 'next-auth/react'
import NavBar from "./navbar (not a page)/navbar.js";
import { AlertProvider } from '@components/CustomAlert';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <SessionProvider>
        <AlertProvider>
          <main style={{ paddingTop: "8vmin" }}> {/* nav bar size*/}
            <NavBar/>
            {children}
          </main>
          </AlertProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
