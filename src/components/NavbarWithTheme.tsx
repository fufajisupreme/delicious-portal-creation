
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Navbar from '@/components/Navbar';

const NavbarWithTheme = () => {
  return (
    <div className="relative">
      <Navbar />
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default NavbarWithTheme;
