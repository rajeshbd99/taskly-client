import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineAddTask } from "react-icons/md";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <nav className="bg-black text-white shadow-lg px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a
            className="flex items-center text-center gap-2 text-3xl font-bold cursor-pointer text-[#FFD700] hover:text-purple-400 transition duration-300"
            onClick={() => navigate("/")}
          >
            Taskly <MdOutlineAddTask/>
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-x-6">
          <button
            className="flex items-center gap-2 px-5 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg font-semibold transition duration-300 shadow-md"
            onClick={() => document.getElementById("AddTaskModal").showModal()}
          >
            <p>Add Task</p>
            <IoAddCircleOutline className="text-2xl" />
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition duration-300 shadow-md"
            >
              <FaSignOutAlt className="text-xl" />
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg font-semibold transition duration-300 shadow-md"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            className="text-teal-400 focus:outline-none hover:text-purple-400 transition duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden mt-4 bg-[#1e1e1e] p-4 rounded-lg shadow-md">
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg font-semibold transition duration-300 shadow-sm"
            onClick={() => {
              document.getElementById("AddTaskModal").showModal();
              setMenuOpen(false);
            }}
          >
            <p>Add Task</p>
            <IoAddCircleOutline className="text-2xl" />
          </button>

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition duration-300 shadow-sm"
            >
              <FaSignOutAlt className="text-xl" />
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
              className="mt-4 w-full px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg font-semibold transition duration-300 shadow-sm"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
