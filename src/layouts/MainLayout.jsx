import { useEffect, useState } from "react";
import Footer from "../components/ui/Footer";
import Navbar from "../components/ui/Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

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
    <div className="min-h-screen flex flex-col justify-between font-poppins overflow-x-hidden">
      <Navbar toggleTheme={toggleTheme} currentTheme={theme} />
      <div className="max-w-[1300px] container mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
