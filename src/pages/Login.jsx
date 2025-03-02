import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { FaEye, FaEyeSlash, FaGoogle, FaLock, FaEnvelope, FaShieldAlt, FaSignInAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from "react-simple-captcha";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user, loginUser, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const axiosPublic = useAxiosPublic();

  // Validate captcha
  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleValidateCaptcha = () => {
    const user_captcha_value = document.getElementById("user_captcha_input").value;
    if (validateCaptcha(user_captcha_value) !== true) {
      toast.error("Captcha does not match. Please try again.");
      return false;
    }
    return true;
  };

  const onSubmit = async (data) => {
    if (!handleValidateCaptcha()) {
      return;
    }
    try {
      await loginUser(data.email, data.password);
      navigate(from, { replace: true });
      toast.success("Welcome back! You’re logged in.");
    } catch (error) {
      toast.error(error.message);
      console.error("Error logging in:", error.message);
    }
  };

  // Auto-generate a user ID for Google sign-in
  const userId = Math.floor(Math.random() * 100000);

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn().then((result) => {
        const userInfo = {
          email: result?.user?.email,
          name: result?.user?.displayName,
          userId: userId,
        };
        axiosPublic.post("/user/add-google-user-data", userInfo).then(() => {
          navigate(from, { replace: true });
          toast.success("Google sign-in successful!");
        });
      });
    } catch (error) {
      toast.error(error.message);
      console.error("Error logging in with Google:", error.message);
    }
  };

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] px-4">
      <Helmet>
        <title>Login | Taskly</title>
      </Helmet>

      <div className="w-full max-w-md p-8 space-y-6 bg-[#1e1e1e] shadow-2xl rounded-2xl border-2 border-[#FFD700]">
        {user && (
          <div className="p-4 text-center text-[#14b8a6] bg-[#1e1e1e] border border-[#FFD700] rounded-md flex flex-col justify-center items-center gap-2">
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-20 rounded-full border-2 border-[#FFD700]"
            />
            <p>Welcome back, {user.displayName || user.email}!</p>
          </div>
        )}

        <h2 className="text-3xl font-bold text-center text-[#8b5cf6] flex items-center justify-center gap-2">
          <FaSignInAlt /> Welcome Back
        </h2>
        <p className="text-center text-gray-400">Log in to manage your tasks effortlessly</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email input */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-[#FFD700]">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD700]" />
              <input
                type="email"
                {...register("email", { required: "Email Address is required" })}
                aria-invalid={errors.email ? "true" : "false"}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 text-sm text-white bg-[#121212] border border-[#FFD700] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>

          {/* Password input */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-[#FFD700]">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD700]" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-2 text-sm text-white bg-[#121212] border border-[#FFD700] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#8b5cf6]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

          {/* Captcha */}
          <div className="flex flex-col items-center">
            <label className="block text-sm font-medium text-[#FFD700] flex items-center gap-2">
              <FaShieldAlt /> Verify Captcha
            </label>
            <LoadCanvasTemplate />
            <input
              id="user_captcha_input"
              type="text"
              name="captcha"
              placeholder="Type captcha"
              className="w-full px-4 py-2 mt-2 text-sm text-white bg-[#121212] border border-[#FFD700] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#8b5cf6] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition duration-300 flex items-center justify-center gap-2"
          >
            <FaSignInAlt /> Login
          </button>
        </form>

        {/* Social login & Register link */}
        <div className="flex flex-col items-center gap-y-4">
          <button
            onClick={() => handleGoogleSignIn()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#14b8a6] text-white font-semibold rounded-lg hover:bg-[#0f766e] transition duration-300"
          >
            <FaGoogle /> Login with Google
          </button>
          <p className="text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#FFD700] hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
