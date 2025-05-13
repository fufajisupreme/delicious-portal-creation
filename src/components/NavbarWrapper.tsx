
import React, { useState } from 'react';
import NavbarContent from './NavbarContent';

const NavbarWrapper = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center relative">
          <NavbarContent isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
      </div>
    </header>
  );
};

export default NavbarWrapper;
