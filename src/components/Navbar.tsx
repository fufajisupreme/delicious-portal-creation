import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // Add a new dashboard link to the main navbar
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Restaurants", href: "/restaurants" },
    { name: "Restaurant Dashboard", href: "/dashboard" }
  ];

  return (
    <nav className="bg-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Delish
        </Link>
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
