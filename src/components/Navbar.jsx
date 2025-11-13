import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/images/podab-01.png";
import { slugify } from "../utils/slug";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [loginPopup, setLoginPopup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // <- used to close popup on route change

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

  // Scroll Hide Navbar
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

  // CLOSE login popup whenever location changes (covers navigation/back/forward)
  useEffect(() => {
    setLoginPopup(false);
    // also close mobile menu on navigation
    setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleNavigate = (area) => {
    navigate(`/properties/${slugify(area)}`);
    setMobileOpen(false);
    setOpenDropdown(null);
    setLoginPopup(false); // also close popup if open
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
    setLoginPopup(false); // close popup if open
  };

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

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

        {/* Right: Login / Logout */}
        <div className="hidden md:flex items-center gap-3 relative">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => setLoginPopup((s) => !s)}
                className="border border-black px-5 py-2 rounded-full font-bold uppercase hover:bg-black hover:text-white transition"
              >
                Login
              </button>

              {/* Login Popup */}
              {loginPopup && (
                <div className="absolute right-6 top-full mt-3 bg-white border shadow-lg rounded-lg p-4 w-48 z-50">
                  {/* Close popup then navigate */}
                  <button
                    onClick={() => {
                      setLoginPopup(false);
                      navigate("/admin/login");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    Admin Login
                  </button>
                  <button
                    onClick={() => {
                      setLoginPopup(false);
                      navigate("/seller/login");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    Seller Login
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="border border-red-500 text-red-600 px-4 py-2 rounded-full font-bold uppercase hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          )}
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

                  {/* Mobile dropdown */}
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

          {/* Login Button - Mobile */}
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => setLoginPopup((s) => !s)}
                className="block text-left border border-black py-2 px-4 rounded-full font-bold uppercase text-sm hover:bg-black hover:text-white transition mt-4"
              >
                Login
              </button>

              {loginPopup && (
                <div className="mt-2 pl-2 space-y-2">
                  <button
                    onClick={() => {
                      setLoginPopup(false);
                      setMobileOpen(false); // close mobile menu
                      navigate("/admin/login");
                    }}
                    className="block w-full text-left text-gray-700 hover:text-black"
                  >
                    Admin Login
                  </button>
                  <button
                    onClick={() => {
                      setLoginPopup(false);
                      setMobileOpen(false);
                      navigate("/seller/login");
                    }}
                    className="block w-full text-left text-gray-700 hover:text-black"
                  >
                    Seller Login
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              className="block text-left border border-red-600 py-2 px-4 rounded-full font-bold uppercase text-sm text-red-600 hover:bg-red-600 hover:text-white transition mt-4"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
