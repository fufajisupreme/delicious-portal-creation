
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarContentProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const NavbarContent = ({ isMenuOpen, toggleMenu }: NavbarContentProps) => {
  return (
    <>
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold">Delish</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <Link to="/#categories">
            <Button variant="ghost">Categories</Button>
          </Link>
          <Link to="/#featured-restaurants">
            <Button variant="ghost">Restaurants</Button>
          </Link>
          <Link to="/#how-it-works">
            <Button variant="ghost">How it Works</Button>
          </Link>
          <Link to="/restaurants">
            <Button variant="ghost">All Restaurants</Button>
          </Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/checkout">
            <Button size="icon" variant="outline">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-expanded={isMenuOpen}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg z-50 animate-fade-down">
          <div className="p-4 flex flex-col space-y-4">
            <Link to="/#categories" className="block py-2 px-4 hover:bg-muted rounded-md">
              Categories
            </Link>
            <Link to="/#featured-restaurants" className="block py-2 px-4 hover:bg-muted rounded-md">
              Restaurants
            </Link>
            <Link to="/#how-it-works" className="block py-2 px-4 hover:bg-muted rounded-md">
              How it Works
            </Link>
            <Link to="/restaurants" className="block py-2 px-4 hover:bg-muted rounded-md">
              All Restaurants
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarContent;
