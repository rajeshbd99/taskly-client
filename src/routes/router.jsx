// import { createBrowserRouter } from "react-router-dom";
// import MainLayout from "../layouts/MainLayout";
// import Home from "../pages/Home";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import NotFound from "../pages/NotFound";
// import { AuthContext } from "../provider/AuthProvider";
// import { useContext } from "react";

// const { user } = useContext(AuthContext);

// const router = createBrowserRouter([
//   {
//     path: "/", // default route
//     children: [
//       {
//         path: "/",
//         element: <Login />,
//       },
//       {
//         path: "/signup",
//         element: <Register />,
//       },
//     ],
//   },
//   {
//     path: "/home",
//     element: <MainLayout />,
//     children: [
//       {
//         path: "/home",
//         element: <Home />,
//       },
//     ],
//   },
//   {
//     path: "*",
//     element: <NotFound />,
//   },
// ]);

// export default router;

import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import { AuthContext } from "../provider/AuthProvider";
import { useContext } from "react";

const AuthWrapper = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Login />;
};

const router = createBrowserRouter([
  {
    path: "/", // default route
    element: (
      <AuthWrapper>
        <MainLayout />
      </AuthWrapper>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Register />,
  },
  {
    path: "/home",
    element: (
      <AuthWrapper>
        <MainLayout />
      </AuthWrapper>
    ),
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
