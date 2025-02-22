import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    const pageTitle = "| Not Found";
    document.title = pageTitle;
  }, [location]);
  return (
    <div className="bg-gray-50 h-screen flex flex-col items-center justify-center">
      {" "}
      <h1 className="text-6xl font-semibold text-cyan-600">404</h1>{" "}
      <p className="text-xl text-cyan-600 mt-4">Page Not Found !!</p>{" "}
      <Link
        to="/"
        className="mt-6 text-lg font-semibold text-cyan-600 hover:text-gray-50 py-2 px-4 border-2 border-cyan-600 rounded-[2rem] hover:bg-cyan-600"
      >
        {" "}
        Go to Home{" "}
      </Link>{" "}
    </div>
  );
};

export default NotFound;
