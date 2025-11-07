'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ["latin"] });

// Create a client component wrapper for the Navbar
const NavbarWrapper = dynamic(() => import('./NavbarWrapper'), {
  ssr: false,
  loading: () => null
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isRootRoute = pathname === '/';
  
  // Only show Navbar if not on auth pages
  const showNavbar = !isAuthPage;

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {showNavbar && <NavbarWrapper isRootRoute={isRootRoute} />}
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
