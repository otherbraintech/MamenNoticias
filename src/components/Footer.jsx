"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full pt-6 py-2 sm:py-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <p className="text-center text-xs sm:text-sm text-gray-500">
          &copy; {new Date().getFullYear()}
          <span className="block sm:inline sm:ml-1">
            Desarrollado por{' '}
            <Link 
              href="https://otherbrain.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OtherBrain
            </Link>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
