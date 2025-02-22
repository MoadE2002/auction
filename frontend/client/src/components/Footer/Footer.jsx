import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black p-12 flex flex-col items-center justify-center text-white h-64">
      {/* Waves */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden">
        <div className="wave bg-wave-pattern opacity-100 animate-wave1"></div>
        <div className="wave bg-wave-pattern opacity-50 animate-wave2"></div>
        <div className="wave bg-wave-pattern opacity-20 animate-wave3"></div>
        <div className="wave bg-wave-pattern opacity-70 animate-wave4"></div>
      </div>

      {/* Social Icons */}
      <ul className="flex space-x-8 my-6">
        <li>
          <a href="#" className="text-4xl transition-transform transform hover:-translate-y-2 text-yellow-500">
            <ion-icon name="logo-facebook"></ion-icon>
          </a>
        </li>
        <li>
          <a href="#" className="text-4xl transition-transform transform hover:-translate-y-2 text-yellow-500">
            <ion-icon name="logo-twitter"></ion-icon>
          </a>
        </li>
        <li>
          <a href="#" className="text-4xl transition-transform transform hover:-translate-y-2 text-yellow-500">
            <ion-icon name="logo-linkedin"></ion-icon>
          </a>
        </li>
        <li>
          <a href="#" className="text-4xl transition-transform transform hover:-translate-y-2 text-yellow-500">
            <ion-icon name="logo-instagram"></ion-icon>
          </a>
        </li>
      </ul>

      {/* Menu Links */}
      <ul className="flex space-x-8 mb-6">
        <li>
          <a href="#" className="text-lg opacity-80 hover:opacity-100 transition-opacity text-yellow-400">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="text-lg opacity-80 hover:opacity-100 transition-opacity text-yellow-400">
            About
          </a>
        </li>
        <li>
          <a href="#" className="text-lg opacity-80 hover:opacity-100 transition-opacity text-yellow-400">
            Services
          </a>
        </li>
        <li>
          <a href="#" className="text-lg opacity-80 hover:opacity-100 transition-opacity text-yellow-400">
            Team
          </a>
        </li>
        <li>
          <a href="#" className="text-lg opacity-80 hover:opacity-100 transition-opacity text-yellow-400">
            Contact
          </a>
        </li>
      </ul>

      {/* Footer Text */}
      <p className="text-base font-light text-gray-400">&copy; 2024 Your Company | All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
