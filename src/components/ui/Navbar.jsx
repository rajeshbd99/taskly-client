import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import { IoAddCircleOutline } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

  const handleLogout = async () => {
    if (user) {
      try {
        await logoutUser();
        // toast.success("User logged out successfully");
        navigate("/"); // Navigate after successful logout
      } catch (error) {
        console.error("Error logging out:", error.message);
      }
    }
  };

  return (
    <div className="navbar bg-indigo-300 shadow-sm px-8 text-yellow-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          {/* <ul
            tabIndex={0}
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul> */}
        </div>
        <a className="btn btn-ghost text-xl">TaskHandler</a>
      </div>
      {/* <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div> */}
      <div className="navbar-end flex gap-x-4">
        <button
          className="px-4 py-2 bg-yellow-200 rounded-xl text-lg text-gray-600 font-semibold cursor-pointer hover:bg-yellow-400 flex gap-x-2 items-center"
          onClick={() => document.getElementById("AddTaskModal").showModal()}
        >
          <p>Add Task</p>
          <IoAddCircleOutline className="text-2xl" />
        </button>
        {user ? (
          <button
            onClick={() => handleLogout()}
            className="px-4 py-2 bg-yellow-200 rounded-xl text-lg text-gray-600 font-semibold cursor-pointer hover:bg-yellow-400"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-yellow-200 rounded-xl text-lg text-gray-600 font-semibold cursor-pointer hover:bg-yellow-400"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
