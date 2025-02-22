import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { createPortal } from "react-dom";

const TaskItem = ({ task, user, setTasks }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
  });
  const axiosSecure = useAxiosSecure();

  const handleDelete = async (event) => {
    event.stopPropagation();
    try {
      await axiosSecure.delete(`/tasks/${task._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await axiosSecure.put(`/tasks/${task._id}`, editedTask);
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="bg-white dark:bg-gray-700 p-2 mb-2 rounded shadow border relative"
      >
        <p className="font-bold">{task.title}</p>
        <p className="text-sm">{task.description}</p>

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setIsEditing(true)}
            onPointerDown={(e) => e.stopPropagation()}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            onPointerDown={(e) => e.stopPropagation()}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Edit Modal (Rendered Outside) */}
      {isEditing &&
        createPortal(
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg w-96">
              <h3 className="font-bold text-lg">Edit Task</h3>
              <input
                type="text"
                className="input input-bordered w-full my-2"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
              />
              <textarea
                className="textarea textarea-bordered w-full my-2"
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
              />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={handleEdit} className="btn btn-primary">
                  Save
                </button>
                <button onClick={() => setIsEditing(false)} className="btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default TaskItem;
