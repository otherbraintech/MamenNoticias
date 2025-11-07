'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

// Dynamically import Navbar to avoid SSR issues
const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false,
  loading: () => null
});

export default function NavbarWrapper({ isRootRoute }) {
  const { status } = useSession();
  
  // Don't show navbar on root route if user is not authenticated
  if (isRootRoute && status !== 'authenticated') {
    return null;
  }
  
  return <Navbar />;
}
