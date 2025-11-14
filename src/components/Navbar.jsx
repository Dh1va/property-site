import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/podab-01.png"; // adjust if your logo path differs
import { slugify } from "../utils/slug"; // optional helper if you have it

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Buy", path: "/buy" },
    { name: "Sell", path: "/sell" },
    { name: "Estimate", path: "/estimate" },
    {
      name: "Properties",
      submenu: [
        { name: "Downtown Dubai" },
        { name: "City Walk" },
        { name: "Al Barari" },
        { name: "Business Bay" },
        { name: "Palm Jumeirah" },
        { name: "Land" },
        { name: "Commercial Building" },
      ],
    },
  ];

  // 🧭 Scroll Hide Navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleNavigate = (area) => {
    navigate(`/properties/${slugify(area)}`);
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Center: Desktop Menu */}
        <div className="hidden md:flex items-center justify-center flex-1 gap-8">
          {navLinks.map((link, idx) => (
            <div
              key={idx}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(link.name)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {link.submenu ? (
                <>
                  <button className="flex items-center gap-1 font-bold uppercase text-gray-900 hover:text-black transition">
                    {link.name}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-full mt-3 bg-white shadow-lg rounded-lg py-3 px-4 w-56 border transition-all duration-200 ${
                      openDropdown === link.name
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                    style={{ minWidth: "200px", zIndex: 9999 }}
                  >
                    {link.submenu.map((sub, j) => (
                      <button
                        key={j}
                        onClick={() => handleNavigate(sub.name)}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-md text-medium"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={link.path}
                  className="font-bold uppercase text-gray-900 hover:text-black transition"
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right: Contact Button (Desktop) */}
        <div className="hidden md:block">
          <Link
            to="/contact"
            className="border border-black px-5 py-2 rounded-full font-bold uppercase hover:bg-black hover:text-white transition"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-900 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-inner px-6 py-4 space-y-4">
          {navLinks.map((link, idx) => (
            <div key={idx}>
              {link.submenu ? (
                <>
                  <button
                    className="flex items-center justify-between w-full text-left font-bold uppercase text-gray-900"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === link.name ? null : link.name
                      )
                    }
                  >
                    {link.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openDropdown === link.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openDropdown === link.name && (
                    <div className="mt-2 pl-3 space-y-2">
                      {link.submenu.map((sub, j) => (
                        <button
                          key={j}
                          onClick={() => handleNavigate(sub.name)}
                          className="block w-full text-left text-gray-700 hover:text-black text-medium"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={link.path}
                  className="block text-gray-900 font-bold uppercase hover:text-black"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}

          {/* Contact Button (Mobile) */}
          <Link
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className="block text-left border border-black py-2 px-4 rounded-full font-bold uppercase text-sm hover:bg-black hover:text-white transition mt-4 w-fit  "
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
