import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useContext, useState } from "react";
import auth from "../firebase/firebase.init";
import { FaEye, FaEyeSlash, FaGoogle, FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../provider/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { Helmet } from "react-helmet-async";

const Register = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const { createUser, googleSignIn } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn().then((result) => {
        const userInfo = {
          email: result?.user?.email,
          name: result?.user?.displayName,
        };
        axiosPublic.post("/user/add-google-user-data", userInfo).then(() => {
          navigate(from, { replace: true });
          toast.success("Logged in successfully with Google!");
        });
      });
    } catch (error) {
      toast.error(error.message);
      console.error("Google Sign-In Error:", error.message);
    }
  };

  const onSubmit = (data) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!passwordRegex.test(data.password)) {
      toast.error(
        "Password must be at least 6 characters and include uppercase & lowercase letters."
      );
      return;
    }

    const userId = Math.floor(Math.random() * 100000);

    createUser(data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
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

        updateProfile(auth.currentUser, {
          displayName: data.username,
          photoURL: data.photoUrl,
        }).catch((error) => {
          console.error("Profile Update Error:", error.message);
        });
      })
      .catch((error) => {
        console.error("Registration Error:", error.message);
        toast.error(error.message);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <Helmet>
        <title>Register - Taskly</title>
      </Helmet>
      <div className="w-full max-w-md p-8 space-y-6 bg-dark-gray bg-opacity-40 backdrop-blur-md rounded-2xl shadow-2xl border border-purple-500">
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-6xl text-gold mb-3 drop-shadow-lg" />
          <h2 className="text-3xl font-bold text-white">Create an Account</h2>
          <p className="text-teal-400 text-center">
            Join Taskly and start managing your tasks like a pro!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gold">
              Username
            </label>
            <input
              type="text"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "At least 3 characters" },
                maxLength: { value: 20, message: "Max 20 characters" },
              })}
              placeholder="Enter a username"
              className="w-full bg-dark-gray text-white px-4 py-2 mt-1 border border-gold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.username && (
              <span className="text-red-500">{errors.username.message}</span>
            )}
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-gold">
              Avatar URL
            </label>
            <input
              type="text"
              {...register("photoUrl", { required: "Avatar URL is required" })}
              placeholder="Enter a photo URL"
              className="w-full bg-dark-gray text-white px-4 py-2 mt-1 border border-gold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.photoUrl && (
              <span className="text-red-500">{errors.photoUrl.message}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gold">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter your email"
              className="w-full bg-dark-gray text-white px-4 py-2 mt-1 border border-gold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gold">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              placeholder="Create a strong password"
              className="w-full bg-dark-gray text-white px-4 py-2 mt-1 border border-gold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-4 top-7 flex items-center text-teal-400 hover:text-purple-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 text-lg font-medium text-black bg-teal-500 bg-gold rounded-lg shadow-lg transform hover:scale-105 transition-all hover:bg-purple-500 hover:text-white"
          >
            Sign Up
          </button>
        </form>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-lg font-medium text-black bg-teal-500 rounded-lg shadow-lg transform hover:scale-105 transition-all hover:bg-purple-500 hover:text-white"
        >
          <FaGoogle />
          Sign Up with Google
        </button>

        {/* Footer Text */}
        <p className="text-center text-teal-400">
          Already have an account?{" "}
          <Link to="/" className="text-gold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
