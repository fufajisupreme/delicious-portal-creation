
import React, { useState, useEffect } from 'react';
import { Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-8",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-md">
              <Utensils className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl">Delish</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </a>
            <a href="#restaurants" className="text-sm font-medium hover:text-primary transition-colors">
              Restaurants
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-sm">Log in</Button>
            <Button variant="default" className="text-sm">Sign up</Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col items-end justify-center gap-1.5">
              <span className={cn(
                "block h-0.5 bg-foreground rounded-full transition-all duration-300 ease-out", 
                mobileMenuOpen ? "w-6 translate-y-2 -rotate-45" : "w-6"
              )}></span>
              <span className={cn(
                "block h-0.5 bg-foreground rounded-full transition-all duration-300 ease-out", 
                mobileMenuOpen ? "opacity-0" : "w-4"
              )}></span>
              <span className={cn(
                "block h-0.5 bg-foreground rounded-full transition-all duration-300 ease-out", 
                mobileMenuOpen ? "w-6 -translate-y-2 rotate-45" : "w-5"
              )}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        )}>
          <div className="flex flex-col space-y-4 pt-4 pb-6">
            <a 
              href="#how-it-works" 
              className="text-sm font-medium hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#categories" 
              className="text-sm font-medium hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </a>
            <a 
              href="#restaurants" 
              className="text-sm font-medium hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Restaurants
            </a>
            <a 
              href="#testimonials" 
              className="text-sm font-medium hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <div className="flex space-x-4 pt-2 px-4">
              <Button variant="ghost" className="text-sm w-full">Log in</Button>
              <Button variant="default" className="text-sm w-full">Sign up</Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
