"use client";

import Link from "next/link";
import { MdCode } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="w-full py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-gray-300">
            <div className="h-px w-8 bg-gray-100"></div>
            <MdCode size={20} />
            <div className="h-px w-8 bg-gray-100"></div>
          </div>
          
          <p className="text-center text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
            &copy; {new Date().getFullYear()} MAMEN NOTICIAS
            <span className="mx-2 text-gray-200">|</span>
            PLATAFORMA DE MONITOREO
          </p>

          <p className="text-center text-xs font-bold text-gray-300">
            Desarrollado con precisión por{' '}
            <Link 
              href="https://otherbrain.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#F22233]/50 hover:text-[#F22233] transition-colors underline decoration-red-100 underline-offset-4"
            >
              OtherBrain
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
