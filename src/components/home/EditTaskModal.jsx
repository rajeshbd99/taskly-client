import { useForm } from "react-hook-form";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../provider/AuthProvider";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaEdit, FaTimesCircle } from "react-icons/fa";

const EditTaskModal = ({ setRefetchTodo }) => {
  const axiosPublic = useAxiosPublic();
  const { user, taskDetails } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Load task details into the form
  useEffect(() => {
    if (taskDetails) {
      reset({
        title: taskDetails.title,
        description: taskDetails.description,
        category: taskDetails.status,
      });
    }
  }, [taskDetails, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await axiosPublic.patch(
        `/user/edit-task/${user?.email}/${taskDetails?.taskId}`,
        {
          title: data.title,
          description: data.description,
          status: data.category,
        }
      );
      document.getElementById("EditTaskModal").close();
      toast.success("Task updated successfully!");
      setRefetchTodo((prev) => !prev);
    } catch (error) {
      document.getElementById("EditTaskModal").close();
      toast.error("Error updating task");
    }
  };

  return (
    <dialog id="EditTaskModal" className="modal">
      <motion.div
        className="modal-box max-w-3xl w-full p-6 bg-gradient-to-br from-[#1E293B] to-[#374151] shadow-2xl rounded-2xl border border-gray-700"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close button */}
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            <FaTimesCircle
              size={24}
              className="text-red-500 hover:text-red-600 transition duration-200"
            />
          </button>
        </form>

        {/* Header */}
        <motion.h1
          className="text-3xl font-semibold text-[#60A5FA] mb-6 flex items-center gap-3"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <FaEdit /> Edit Task
        </motion.h1>

        {/* Form */}
        <form
          className="flex flex-col items-center justify-center gap-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Task Title */}
          <motion.div
            className="relative w-full max-w-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-300">
              Task Title
            </label>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
                maxLength: { value: 50, message: "Title cannot exceed 50 characters" },
              })}
              placeholder="Enter task title"
              className="w-full px-4 py-3 mt-1 text-sm bg-[#1F2937] text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <span className="text-red-500 text-sm">{errors.title.message}</span>
            )}
          </motion.div>

          {/* Task Description */}
          <motion.div
            className="relative w-full max-w-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-300">
              Task Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                maxLength: { value: 200, message: "Description cannot exceed 200 characters" },
              })}
              rows="4"
              placeholder="Enter task description"
              className="w-full px-4 py-3 mt-1 text-sm bg-[#1F2937] text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description.message}</span>
            )}
          </motion.div>

          {/* Task Category */}
          <motion.div
            className="relative w-full max-w-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-300">
              Task Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full px-4 py-3 mt-1 text-sm bg-[#1F2937] text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="to-do">To-Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            {errors.category && (
              <span className="text-red-500 text-sm">{errors.category.message}</span>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full max-w-2xl py-3 mt-4 text-lg font-medium text-white bg-[#3B82F6] rounded-lg shadow-md hover:bg-[#2563EB] transition-transform transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Changes
          </motion.button>
        </form>
      </motion.div>
    </dialog>
  );
};

export default EditTaskModal;
