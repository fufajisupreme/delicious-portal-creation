
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useAuth } from '@/contexts/AuthContext';
import CitySelector from './CitySelector';
import UserMenu from './auth/UserMenu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            FoodDelivery
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/restaurants" className="hover:text-primary transition-colors">
              Restaurants
            </Link>
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              How it works
            </a>
            <a href="#testimonials" className="hover:text-primary transition-colors">
              Testimonials
            </a>
          </nav>

          {/* City Selector & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <CitySelector variant="compact" />
            {isLoggedIn ? (
              <>
                <UserMenu />
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger className="md:hidden">
              <Menu className="h-6 w-6 cursor-pointer" onClick={toggleMenu} />
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <div className="flex justify-end">
                <SheetClose asChild>
                  <Button variant="ghost" className="hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
              <div className="flex flex-col space-y-4 py-6">
                <Link to="/" className="hover:text-primary transition-colors block">
                  Home
                </Link>
                <Link to="/restaurants" className="hover:text-primary transition-colors block">
                  Restaurants
                </Link>
                <a href="#how-it-works" className="hover:text-primary transition-colors block">
                  How it works
                </a>
                <a href="#testimonials" className="hover:text-primary transition-colors block">
                  Testimonials
                </a>
                <CitySelector variant="compact" />
                {isLoggedIn ? (
                  <>
                    <UserMenu />
                    <Button variant="outline" size="sm" onClick={logout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button size="sm">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
