import {
  FaFacebook,
  FaLinkedin,
  FaSquareXTwitter,
  FaInstagram,
} from "react-icons/fa6";
import { MdOutlineAddTask } from "react-icons/md";

function Footer() {
  return (
    <div className="bg-black text-gray-300 py-8 px-6 flex flex-col items-center">
      <footer className="footer flex flex-wrap justify-between items-center w-full max-w-7xl">
        {/* Branding Section */}
        <div className="flex flex-col items-start max-w-xs">
          <h2 className="flex items-center text-center gap-2 text-3xl font-bold text-[#FFD700] hover:text-purple-400 transition duration-300">
            Taskly <MdOutlineAddTask/>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Simplify your tasks and boost productivity with Taskly — your
            trusted task management platform.
          </p>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col items-start">
          <h6 className="text-lg font-semibold mb-2 text-purple-400">
            Contact Us
          </h6>
          <a
            className="link link-hover text-gray-400 hover:text-purple-400 transition duration-300"
            href="mailto:support@tasklyapp.com"
          >
            support@tasklyapp.com
          </a>
          <a
            className="link link-hover text-gray-400 hover:text-purple-400 transition duration-300"
            href="tel:+15551234567"
          >
            +1 (555) 123-4567
          </a>
          <p className="text-gray-400">San Francisco, CA, USA</p>
        </div>

        {/* Social Section */}
        <div className="flex flex-col items-start">
          <h6 className="text-lg font-semibold mb-2 text-purple-400">
            Follow Us
          </h6>
          <div className="flex gap-4">
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover flex items-center gap-2 text-gray-400 hover:text-purple-400 transition duration-300"
            >
              <FaLinkedin
                size={20}
                className="hover:scale-110 hover:shadow-purple-400/50 transition duration-300"
              />
              LinkedIn
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover flex items-center gap-2 text-gray-400 hover:text-purple-400 transition duration-300"
            >
              <FaSquareXTwitter
                size={20}
                className="hover:scale-110 hover:shadow-purple-400/50 transition duration-300"
              />
              Twitter
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover flex items-center gap-2 text-gray-400 hover:text-purple-400 transition duration-300"
            >
              <FaFacebook
                size={20}
                className="hover:scale-110 hover:shadow-purple-400/50 transition duration-300"
              />
              Facebook
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover flex items-center gap-2 text-gray-400 hover:text-purple-400 transition duration-300"
            >
              <FaInstagram
                size={20}
                className="hover:scale-110 hover:shadow-purple-400/50 transition duration-300"
              />
              Instagram
            </a>
          </div>
        </div>
      </footer>

      {/* Copyright Section */}
      <div className="mt-6 w-full max-w-7xl">
        <hr className="border-gray-700" />
        <p className="text-center mt-4 text-sm text-gray-500">
          &copy; 2025 Taskly. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
