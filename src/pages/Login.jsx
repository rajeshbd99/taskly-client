import { useState, useRef, useContext, useEffect } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  LoadCanvasTemplateNoReload,
  validateCaptcha,
} from "react-simple-captcha";
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

  //validate captcha
  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleValidateCaptcha = () => {
    let user_captcha_value =
      document.getElementById("user_captcha_input").value;

    if (validateCaptcha(user_captcha_value) !== true) {
      toast.error("Captcha Does Not Match");
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
      toast.success("User logged in successfully!");
    } catch (error) {
      toast.error(error.message);
      console.error("Error logging in:", error.message);
    }
  };
  //autogenerate a user id while signup
  const userId = Math.floor(Math.random() * 100000);

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn().then((result) => {
        const userInfo = {
          email: result?.user?.email,
          name: result?.user?.displayName,
          userId: userId,
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
  //toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <Helmet>
        <title>Taskly</title>
      </Helmet>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="">
          {user && (
            <div className="p-4 text-center text-green-600 bg-green-100 rounded-md flex flex-col justify-center items-center gap-2">
              <img
                src={user.photoURL}
                alt="Avatar"
                className="w-20 rounded-full border-2 border-neutral"
              />
              <p className="">
                Logged in successfully! {user.displayName || user.email}
              </p>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* email input */}
          <div className="relative mb-8">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email Address is required" })}
              aria-invalid={errors.email ? "true" : "false"}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            />
            {errors.email && (
              <span className="text-red-500 absolute bottom-[-25px] left-0">
                {errors.email.message}
              </span>
            )}
          </div>
          {/* password input */}
          <div className="relative mb-8">
            <input
              type={showPassword ? "text" : "password"}
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
              })}
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-4 top-0 flex items-center text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <span className="text-red-500 absolute bottom-[-25px] left-0">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* captcha */}
          <div className="flex justify-center py-4">
            <label>
              <LoadCanvasTemplate />
            </label>
            <input
              id="user_captcha_input"
              type="text"
              name="captcha"
              placeholder="type captcha"
              className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-lg font-medium text-white bg-indigo-700 rounded-md hover:bg-indigo-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>
        <div className="flex flex-col gap-y-3 items-center justify-center">
          <button
            onClick={() => handleGoogleSignIn()}
            className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-300 rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <FaGoogle />
            <p className="text-lg">Login with Google</p>
          </button>
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
