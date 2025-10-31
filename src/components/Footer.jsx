import React from "react";
import Logo from "../assets/images/podab-01.png";
import cslogo from "../assets/images/Cleverso logo grey-02.png";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white text-black px-8 md:px-16 lg:px-24 flex flex-col justify-between min-h-[90vh]">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-16 py-20">
        {/* LEFT: Logo + About */}
        <div className="flex-1 max-w-sm">
          <a href="/" className="inline-flex items-center">
            <img
              src={Logo}
              alt="Logo"
              className="h-14 w-auto object-contain"
            />
          </a>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            Discover luxury properties and premium investments in Dubai.
            We bring you world-class real estate opportunities with trust,
            transparency, and expertise.
          </p>
        </div>

        {/* MIDDLE: Navigation Links */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-10 text-lg">
          <div>
            <p className="font-semibold text-xl mb-4">Explore</p>
            <ul className="space-y-3 list-disc list-inside text-gray-700">
              <li><a href="/" className="hover:text-black transition">Buy</a></li>
              <li><a href="/" className="hover:text-black transition">Sell</a></li>
              <li><a href="/" className="hover:text-black transition">Estimate</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xl mb-4">Properies</p>
            <ul className="space-y-3 list-disc list-inside text-gray-700">
              <li><a href="/" className="hover:text-black transition">In Coimbatore</a></li>
              <li><a href="/" className="hover:text-black transition">In Chennai</a></li>
              <li><a href="/" className="hover:text-black transition">In Erode</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xl mb-4">Know How</p>
            <ul className="space-y-3 list-disc list-inside text-gray-700">
              <li><a href="/" className="hover:text-black transition">Know Difference</a></li>
              <li><a href="/" className="hover:text-black transition">Join Us</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section (New Row) */}
      <div className="border-t border-gray-200 py-12 text-center">
        <p className="font-semibold text-2xl mb-4">Subscribe to Our Newsletter</p>
        <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
          Stay updated on new properties, investment insights, and exclusive offers.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 py-6 mt-auto">
        <p className="text-base text-gray-600">
          © 2025 Cleverso India. All rights reserved.
        </p>
        <a href="/" className="mt-4 sm:mt-0">
          <img src={cslogo} alt="Cleverso Logo" className="w-[45px]" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
