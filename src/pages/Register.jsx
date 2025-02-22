import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.init";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../provider/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { Helmet } from "react-helmet-async";

const Register = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const { createUser, googleSignIn } = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn().then((result) => {
        const userInfo = {
          email: result?.user?.email,
          name: result?.user?.displayName,
        };
        axiosPublic.post("/user/add-google-user-data", userInfo).then((res) => {
          navigate(from, { replace: true });
          toast.success("User logged in successfully!");
        });
      });
    } catch (error) {
      toast.error(error.message);
      console.error("Error logging in with Google:", error.message);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    // Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter,
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    // Validate password
    if (!passwordRegex.test(data.password)) {
      toast.error(
        "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter."
      );
      return;
    }
    //autogenerate a user id while signup
    const userId = Math.floor(Math.random() * 100000);

    // Create user using Auth Provider
    createUser(data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Save user data to MongoDB
        const userInfo = {
          name: data.username,
          email: data.email,
          userId: userId,
          photoURL: data.photoUrl,
        };
        axiosPublic.post("/user/add-user-data", userInfo).then((res) => {
          if (res.data.insertedId) {
            reset();
            toast.success("User registered successfully!");
            navigate(from, { replace: true });
          }
        });

        // update user profile
        updateProfile(auth.currentUser, {
          displayName: data.username,
          photoURL: data.photoUrl,
        }).catch((error) => {
          console.error(
            "Error updating user profile:",
            error.code,
            error.message
          );
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error("Error registering user:", error.code, errorMessage);
        toast.error(errorMessage);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Helmet>
        <title>Taskly</title>
      </Helmet>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "must be at least 3 characters long",
                },
                maxLength: {
                  value: 20,
                  message: "cannot exceed 20 characters",
                },
              })}
              autoComplete="name"
              placeholder="Enter a username"
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 border-1 border-gray-800 text-gray-800"
            />
            {errors.username && (
              <span className="text-red-500">{errors.username.message}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="photoUrl"
              className="block text-sm font-medium text-gray-600"
            >
              Avatar URL
            </label>
            <input
              type="text"
              id="photoUrl"
              {...register("photoUrl", { required: "Avatar URL is required" })}
              autoComplete="photo"
              placeholder="Enter a photo URL"
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 border-1 border-gray-800 text-gray-800"
            />
            {errors.photoUrl && (
              <span className="text-red-500">{errors.photoUrl.message}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Email is required" })}
              autoComplete="email"
              placeholder="Enter a valid e-mail"
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 border-1 border-gray-800 text-gray-800"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least six characters long",
                },
                maxLength: {
                  value: 20,
                  message: "Password cannot exceed 20 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z]{6,}$/,
                  message: "must contain one uppercase and lowercase letter",
                },
              })}
              autoComplete="new-password"
              placeholder="Enter a strong password"
              className="w-full px-4 py-2 mt-1 text-sm border-1 border-gray-800 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-4 top-5 flex items-center text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-lg font-medium text-white bg-indigo-700 rounded-md hover:bg-indigo-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign Up
          </button>
        </form>

        <button
          onClick={() => handleGoogleSignIn()}
          className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-300 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <FaGoogle />
          <p className="text-lg">Login with Google</p>
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
        {errors && <p className="text-sm text-red-500">{errors.message}</p>}
      </div>
    </div>
  );
};

export default Register;
