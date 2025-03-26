// src/components/Layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-black bg-opacity-80 shadow-lg mt-8 mb-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <div className="flex justify-center space-x-6 mt-2">
              <Link to="/about" className="text-gray-300 hover:text-blue-400">About Us</Link>
              <Link to="/contact" className="text-gray-300 hover:text-blue-400">Contact Us</Link>
              <Link to="/privacy" className="text-gray-300 hover:text-blue-400">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-gray-400 pb-4">© 2025 MovieMate. All rights reserved.</p>
    </footer>
  );
}

export default Footer;