'use client'
import "./globals.css";
import { SessionProvider } from 'next-auth/react'
import NavBar from "./navbar (not a page)/navbar.js";
import { AlertProvider } from '@components/CustomAlert';
import { CAlertProvider } from '@components/CustomConfirmation';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <SessionProvider>
        <CAlertProvider>
        <AlertProvider>
          <main style={{ paddingTop: "8vmin" }}> {/* nav bar size*/}
            <NavBar/>
            {children}
          </main>
          </AlertProvider>
          </CAlertProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
