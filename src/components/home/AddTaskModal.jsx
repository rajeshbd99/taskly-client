import { useForm } from "react-hook-form";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../provider/AuthProvider";
import { useContext } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTasks, FaTimesCircle } from "react-icons/fa";

const AddTaskModal = ({ setRefetchTodo }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Generate a random task ID
  const taskId = Math.floor(Math.random() * 10000);

  // Get current time
  const getCurrentTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const strTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
    return `${date} ${strTime}`;
  };

  // Handle form submission
  const onSubmit = async (data) => {
    const task = [
      {
        taskId,
        title: data.title,
        description: data.description,
        status: data.category,
        timeStamp: getCurrentTime(),
      },
    ];
    try {
      await axiosPublic.post(`/user/post-task/${user?.email}`, { task });
      document.getElementById("AddTaskModal").close();
      toast.success("Task added successfully!");
      reset();
      setRefetchTodo((prev) => !prev);
    } catch (error) {
      document.getElementById("AddTaskModal").close();
      toast.error("Error adding task");
    }
  };

  return (
    <dialog id="AddTaskModal" className="modal">
      <motion.div
        className="modal-box max-w-2xl w-full p-6 bg-[#1E1E2E] text-gray-300 shadow-2xl rounded-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <FaTimesCircle size={20} className="text-red-500 hover:text-red-600" />
          </button>
        </form>

        <motion.h1
          className="text-3xl font-semibold text-[#FFD700] mb-6 flex items-center gap-3"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <FaTasks /> Add a New Task
        </motion.h1>

        <form
          className="flex flex-col items-center justify-center gap-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Task Title */}
          <motion.div
            className="relative w-full max-w-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-400">
              Task Title
            </label>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
                maxLength: { value: 50, message: "Title cannot exceed 50 characters" },
              })}
              className="w-full px-4 py-3 mt-1 text-sm bg-[#2A2A40] text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />
            {errors.title && (
              <span className="text-red-500 text-sm">{errors.title.message}</span>
            )}
          </motion.div>

          {/* Task Description */}
          <motion.div
            className="relative w-full max-w-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-400">
              Task Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                maxLength: { value: 200, message: "Description cannot exceed 200 characters" },
              })}
              rows="3"
              className="w-full px-4 py-3 mt-1 text-sm bg-[#2A2A40] text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description.message}</span>
            )}
          </motion.div>

          {/* Task Category */}
          <motion.div
            className="relative w-full max-w-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-400">
              Task Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full px-4 py-3 mt-1 text-sm bg-[#2A2A40] text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            >
              <option value="">Select a category</option>
              <option value="to-do">To-Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            {errors.category && (
              <span className="text-red-500 text-sm">{errors.category.message}</span>
            )}
          </motion.div>

          {/* Add Task Button */}
          <motion.button
            type="submit"
            className="w-full max-w-lg py-3 mt-4 text-lg font-medium text-[#1E1E2E] bg-[#FFD700] rounded-lg shadow-md hover:bg-[#FFC300] transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Task
          </motion.button>
        </form>
      </motion.div>
    </dialog>
  );
};

export default AddTaskModal;
