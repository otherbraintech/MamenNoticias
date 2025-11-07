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

  // Don't render the navbar on the login page
  if (isLoginPage) {
    return null;
  }

  return (
    <nav className="bg-[#F20519] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center relative">
        {/* Logo izquierdo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="https://i.ibb.co/S4RYMHRv/Proyecto-nuevo-18.png"
            alt="Vos Logo"
            width={140}
            height={40}
            priority 
          />
        </Link>
        <Link href="/auth/login" className="flex-shrink-0">
          <Image
            src="https://i.ibb.co/VWTwhb0J/logo-Mamen-Noticias.png"
            alt="Mamen Logo"
            width={140}
            height={40}
            priority 
          />
        </Link>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-6 text-[#ffffff] font-semibold text-base items-center">
          {!session?.user ? (
            <>
              <li>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 hover:text-[#33ffff] transition-colors"
                >
                  <AiOutlineLogin size={20} />
                  Iniciar sesión
                </Link>
              </li>
              {/*
              <li>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 hover:text-[#ff4d4d] transition-colors"
                >
                  <AiOutlineUserAdd size={20} />
                  Registrarse
                </Link>
              </li>
              */}
            </>
          ) : (
            <li>
              <SignOutButton />
            </li>
          )}
        </ul>

        {/* Mobile menu */}
        <details className="md:hidden relative group">
          <summary className="cursor-pointer text-[#123488] font-semibold text-sm">
            ☰ Menú
          </summary>
          <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-2 text-sm">
            {!session?.user ? (
              <>
                <li>
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 hover:bg-gray-100 text-[#123488]"
                  >
                    <AiOutlineLogin className="inline mr-1 " />
                    Iniciar sesión
                  </Link>
                </li>
                {/*
                <li>
                  <Link
                    href="/auth/register"
                    className="block px-4 py-2 hover:bg-gray-100 text-[#123488]"
                  >
                    <AiOutlineUserAdd className="inline mr-1" />
                    Registrarse
                  </Link>
                </li>
                */}
              </>
            ) : (
              <li className="px-4 py-2">
                <SignOutButton />
              </li>
            )}
          </ul>
        </details>
      </div>
    </nav>
  );
}
