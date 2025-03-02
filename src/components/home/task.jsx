import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrashAlt, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

const TaskItem = ({ task, user, setTasks }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task._id });
  const axiosSecure = useAxiosSecure();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
  });

  // Delete task
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosSecure.delete(`/tasks/${task._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  // Edit task
  const handleEdit = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.put(`/tasks/${task._id}`, editedTask);
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
      toast.success("Task updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Drag style
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    boxShadow: transform ? "0px 10px 20px rgba(0, 0, 0, 0.2)" : "",
    cursor: transform ? "grabbing" : "grab",
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="bg-white dark:bg-gray-800 p-4 mb-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 relative"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-indigo-700">{task.title}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{task.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition"
            >
              <FaEdit />
              Edit
            </button>
            <button
              onClick={() => setIsDeleting(true)}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
            >
              <FaTrashAlt />
              Delete
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className={`mt-4 text-xs font-semibold px-2 py-1 rounded ${task.status === "done" ? "bg-green-200 text-green-800" : task.status === "in-progress" ? "bg-yellow-200 text-yellow-800" : "bg-gray-200 text-gray-800"}`}>
          {task.status.toUpperCase()}
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing &&
          createPortal(
            <motion.div
              className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-xl text-indigo-700">Edit Task</h3>
                  <button onClick={() => setIsEditing(false)} className="text-red-500 hover:text-red-600">
                    <FaTimes size={24} />
                  </button>
                </div>

                <input
                  type="text"
                  className="input input-bordered w-full my-2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                />
                <textarea
                  className="textarea textarea-bordered w-full my-2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                />

                <div className="flex justify-end gap-2 mt-4">
                  <motion.button
                    onClick={handleEdit}
                    className="btn bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </motion.button>
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    className="btn bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>,
            document.body
          )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {isDeleting &&
          createPortal(
            <motion.div
              className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <FaExclamationTriangle className="text-red-500 mx-auto mb-4" size={48} />
                <h3 className="font-bold text-lg text-red-600 mb-4">Are you sure you want to delete this task?</h3>
                <div className="flex justify-end gap-2">
                  <motion.button onClick={handleDelete} className="btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    {loading ? "Deleting..." : "Delete"}
                  </motion.button>
                  <motion.button onClick={() => setIsDeleting(false)} className="btn bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>,
            document.body
          )}
      </AnimatePresence>
    </>
  );
};

export default TaskItem;
