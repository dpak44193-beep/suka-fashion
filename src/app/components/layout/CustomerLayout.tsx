import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="page-main flex flex-col min-h-screen min-h-[100dvh]">
    <Navbar />
    <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">{children}</main>
    <Footer />
  </div>
);
