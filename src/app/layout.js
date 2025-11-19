// src/app/layout.js
"use client"; // <--- Add this directive at the very top

import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// *** REMOVE the problematic import from here:
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./globals.css";

import { useEffect } from 'react'; // <--- Import useEffect

const geistSans = Geist({
  // ...
});

export default function RootLayout({ children }) {
  // Use useEffect to ensure the import/require only happens on the client
  useEffect(() => {
    // This code runs *only* in the browser after the component has mounted.
    // It safely avoids the 'document is not defined' error on the server.
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}