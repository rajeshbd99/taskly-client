import { useDraggable } from "@dnd-kit/core";
import { IoMdTimer } from "react-icons/io";
import { FaGripVertical, FaTrashAlt, FaEdit, FaExclamationTriangle } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../provider/AuthProvider";

const TaskCard = ({ task, setRefetchTodo }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  const axiosPublic = useAxiosPublic();
  const { user, setTaskDetails } = useContext(AuthContext);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.taskId,
    activationConstraint: { delay: 250, tolerance: 5 },
  });

  // Update mobile flag on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    ...(!isMobile ? { touchAction: "none" } : {}),
  };

  // Handle delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosPublic.delete(`/user/delete-task/${user?.email}/${task?.taskId}`);
      toast.success("Task deleted successfully!");
      setRefetchTodo((prev) => !prev);
    } catch (error) {
      toast.error("Error deleting task");
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  // Handle edit
  const handleEdit = () => {
    try {
      axiosPublic.get(`/user/get-task/${user?.email}/${task?.taskId}`).then((res) => {
        setTaskDetails(res.data);
        document.getElementById("EditTaskModal").showModal();
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "to-do":
        return "bg-pink-200 text-pink-600";
      case "in-progress":
        return "bg-yellow-200 text-yellow-600";
      case "done":
        return "bg-green-200 text-green-600";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  // Status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "to-do":
        return "📝";
      case "in-progress":
        return "⚡";
      case "done":
        return "✅";
      default:
        return "❓";
    }
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-[380px] p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl cursor-grab active:cursor-grabbing hover:shadow-lg dark:hover:shadow-[0px_0px_20px_rgba(255,255,255,0.05)] overflow-hidden"
      >
        <button
          {...listeners}
          {...attributes}
          style={{ touchAction: "none" }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing"
        >
          <FaGripVertical size={24} />
        </button>

        <div className="flex flex-col">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
            {task.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 break-words">
            {task.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-medium px-4 py-1 rounded-full ${getStatusColor(task.status)}`}
            >
              {getStatusIcon(task.status)} {task.status}
            </span>

            <div className="flex items-center gap-2">
              <IoMdTimer className="text-lg sm:text-xl text-indigo-600" />
              <span className="text-xs sm:text-md font-semibold text-gray-800 dark:text-gray-300">
                {task.timeStamp || "No deadline"}
              </span>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <motion.button
              onClick={handleEdit}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm shadow hover:bg-blue-600"
            >
              <FaEdit />
              Edit
            </motion.button>

            <motion.button
              onClick={() => setIsDeleting(true)}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm shadow hover:bg-red-600"
            >
              <FaTrashAlt />
              Delete
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {isDeleting && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <FaExclamationTriangle className="text-red-500 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                Are you sure you want to delete this task?
              </h3>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setIsDeleting(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TaskCard;
