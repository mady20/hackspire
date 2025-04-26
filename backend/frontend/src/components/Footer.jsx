import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Creator Platform
            </Link>
            <p className="mt-4 text-base text-gray-500">
              Supporting creators through Web3 technology. Connect, fund, and grow together.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Platform
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/explore" className="text-base text-gray-500 hover:text-gray-900">
                  Explore Creators
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-base text-gray-500 hover:text-gray-900">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/become-creator" className="text-base text-gray-500 hover:text-gray-900">
                  Become a Creator
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/faq" className="text-base text-gray-500 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Documentation
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Creator Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
