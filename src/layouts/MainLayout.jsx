import { useEffect, useState } from "react";
import Footer from "../components/ui/Footer";
import Navbar from "../components/ui/Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className={`min-h-[100dvh] flex flex-col font-poppins overflow-x-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-[#121212] text-gray-300" : "bg-[#121212] text-gray-800"
      }`}
    >
      {/* Navbar */}
      <Navbar toggleTheme={toggleTheme} currentTheme={theme} />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1300px] mx-auto px-4 py-4 md:py-6">
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default MainLayout;
