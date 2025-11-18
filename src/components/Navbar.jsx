"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { getSession } from "next-auth/react";
import { AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai";
import SignOutButton from "./SignOutButton";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [session, setSession] = useState(null);
  const pathname = usePathname();
  const isLoginPage = pathname === '/auth/login';

  useEffect(() => {
    const loadSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    loadSession();
  }, []);
  if (isLoginPage) {
    return null;
  }

  return (
    <nav className="bg-[#F20519] shadow-md sticky top-0 z-50 h-16">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Logo Vos - Visible solo en pantallas medianas y grandes */}
          <Link href="/" className="hidden md:block">
            <Image
              src="https://i.ibb.co/S4RYMHRv/Proyecto-nuevo-18.png"
              alt="Vos Logo"
              width={140}
              height={40}
              priority 
              className="flex-shrink-0"
            />
          </Link>
          
          {/* Logo Mamen Noticias */}
          <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="https://i.ibb.co/VWTwhb0J/logo-Mamen-Noticias.png"
                alt="Mamen Noticias"
                width={140}
                height={40}
                priority
              />
            </Link>
          </div>
        </div>

        <ul className="flex gap-6 text-[#ffffff] font-semibold text-base items-center">
          {!session?.user ? (
            <>
              <li className="hidden md:block">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 hover:text-[#33ffff] transition-colors"
                >
                  <AiOutlineLogin size={20} />
                  <span className="hidden md:inline">Iniciar sesión</span>
                </Link>
              </li>
              {/*
              <li className="hidden md:block">
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 hover:text-[#ff4d4d] transition-colors"
                >
                  <AiOutlineUserAdd size={20} />
                  <span className="hidden md:inline">Registrarse</span>
                </Link>
              </li>
              */}
            </>
          ) : (
            <li className="flex items-center">
              <SignOutButton />
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
