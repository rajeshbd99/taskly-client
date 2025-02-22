import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Handle theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    if (user) {
      try {
        await logoutUser();
        navigate("/");
      } catch (error) {
        console.error("Error logging out:", error.message);
      }
    }
  };

  return (
    <nav className="bg-indigo-600 dark:bg-gray-900 text-white shadow-md px-6 md:px-10 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <a
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Taskly
        </a>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          className="text-white focus:outline-none"
          onClick={() =>
            document.getElementById("mobileMenu").classList.toggle("hidden")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-8 6h8"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-x-6">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-yellow-300 text-gray-800 rounded-xl font-semibold hover:bg-yellow-400 transition"
          onClick={() => document.getElementById("AddTaskModal").showModal()}
        >
          <p>Add Task</p>
          <IoAddCircleOutline className="text-2xl" />
        </button>

        {/* Light/Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 bg-gray-800 text-yellow-300 rounded-xl font-semibold hover:bg-gray-700 transition dark:bg-yellow-300 dark:text-gray-800"
        >
          {darkMode ? <FaSun className="text-2xl" /> : <FaMoon className="text-2xl" />}
        </button>

        {user ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 rounded-xl text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-yellow-300 rounded-xl text-gray-800 font-semibold hover:bg-yellow-400 transition"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        id="mobileMenu"
        className="absolute top-16 left-0 w-full bg-indigo-700 dark:bg-gray-800 text-white p-4 hidden lg:hidden"
      >
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-300 text-gray-800 rounded-xl font-semibold hover:bg-yellow-400 transition"
          onClick={() => document.getElementById("AddTaskModal").showModal()}
        >
          <p>Add Task</p>
          <IoAddCircleOutline className="text-2xl" />
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-4 w-full px-4 py-2 bg-gray-800 text-yellow-300 rounded-xl font-semibold hover:bg-gray-700 transition dark:bg-yellow-300 dark:text-gray-800"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {user ? (
          <button
            onClick={handleLogout}
            className="mt-4 w-full px-4 py-2 bg-red-500 rounded-xl text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 w-full px-4 py-2 bg-yellow-300 rounded-xl text-gray-800 font-semibold hover:bg-yellow-400 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
