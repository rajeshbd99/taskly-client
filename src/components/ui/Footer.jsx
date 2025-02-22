import { FaFacebook, FaLinkedin, FaSquareXTwitter, FaInstagram } from "react-icons/fa6";

function Footer() {
  return (
    <div className="bg-indigo-800 text-yellow-100 py-6 px-6 flex flex-col items-center">
      <footer className="footer flex flex-wrap justify-between items-center w-full max-w-7xl">
        <div className="flex flex-col items-start max-w-xs">
          <h2 className="text-3xl font-bold">Taskly</h2>
          <p className="mt-2 text-sm">
            Simplify your tasks and boost productivity with Taskly - your trusted task management platform.
          </p>
        </div>

        <div className="flex flex-col items-start">
          <h6 className="text-lg font-semibold mb-2">Contact Us</h6>
          <a className="link link-hover">support@tasklyapp.com</a>
          <a className="link link-hover">+1 (555) 123-4567</a>
          <a className="link link-hover">San Francisco, CA, USA</a>
        </div>

        <div className="flex flex-col items-start">
          <h6 className="text-lg font-semibold mb-2">Follow Us</h6>
          <div className="flex gap-4">
            <a href="https://linkedin.com/" target="_blank" className="link link-hover flex items-center gap-2">
              <FaLinkedin size={20} /> LinkedIn
            </a>
            <a href="https://x.com/" target="_blank" className="link link-hover flex items-center gap-2">
              <FaSquareXTwitter size={20} /> Twitter
            </a>
            <a href="https://facebook.com/" target="_blank" className="link link-hover flex items-center gap-2">
              <FaFacebook size={20} /> Facebook
            </a>
            <a href="https://instagram.com/" target="_blank" className="link link-hover flex items-center gap-2">
              <FaInstagram size={20} /> Instagram
            </a>
          </div>
        </div>
      </footer>

      <div className="mt-4 w-full max-w-7xl">
        <hr className="border-yellow-100/30" />
        <p className="text-center mt-2 text-sm">
          &copy; 2025 Taskly. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
