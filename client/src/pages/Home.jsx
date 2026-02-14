import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-transparent text-gray-800">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <img 
          src="https://ik.imagekit.io/nx2mu5rdoc/dummy/bbau-satellite-campus-tikarmafi-sultanpur-universities-F5qm5mLNwE.avif?updatedAt=1760987460471" 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" 
          alt="BBAU Campus" 
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center bg-gradient-to-b from-black/60 via-black/30 to-black/60 px-4 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl leading-tight">
            Babasaheb Bhimrao Ambedkar University Library
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 font-medium drop-shadow-lg max-w-3xl">
            Your gateway to a world of knowledge, research, and academic excellence.
          </p>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Link to="/books" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold mb-2 text-red-600">Search Books</h3>
            <p className="text-gray-600">Explore our vast collection of books and resources.</p>
          </Link>
          <Link to="/my-issues" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold mb-2 text-red-600">My Issued</h3>
            <p className="text-gray-600">View your borrowed books and due dates.</p>
          </Link>
          <a href="#" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold mb-2 text-red-600">E-Resources</h3>
            <p className="text-gray-600">Access our digital library of e-books and journals.</p>
          </a>
        </div>
      </div>

      {/* News & Announcements Section */}
      <div className="bg-white py-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">News & Announcements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-l-4 border-red-500 pl-4 bg-gray-50 p-4 rounded-r-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2 text-gray-800">New Library Timings</h3>
              <p className="text-gray-600">The library will now be open from 10 AM to 5 PM on all working days.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 border-t-4 border-red-600">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold">&copy; 2025 Babasaheb Bhimrao Ambedkar University. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}