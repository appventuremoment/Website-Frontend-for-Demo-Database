import "./globals.css";
import NavBar from "./navbar (not a page)/navbar.js";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>
          <NavBar/>
          {children}
        </main>
      </body>
    </html>
  );
}
