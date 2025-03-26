// Layout.js
import React from 'react';
import Header from './Header'; // This will render the header
import Footer from './Footer';
import bg from "./background.jpg";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black relative">
      <div 
        className="fixed inset-0 opacity-40 pointer-events-none" 
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)'
        }}
      />
      <Header />  {/* This already includes the header */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
