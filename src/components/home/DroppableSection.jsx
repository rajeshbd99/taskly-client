import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { motion } from "framer-motion";
import { FaTasks, FaCheckCircle } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";

const DroppableSection = ({ id, title, tasks, setRefetchTodo }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const sectionStyles = {
    "to-do": {
      bg: "bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9]", // Purple gradient
      border: "border-[#FFD700]", // Gold border
      icon: <FaTasks className="text-[#FFD700] text-3xl" />, // Gold icon
    },
    "in-progress": {
      bg: "bg-gradient-to-br from-[#14b8a6] to-[#0f766e]", // Teal gradient
      border: "border-[#FFD700]", // Gold border
      icon: (
        <GrInProgress className="text-[#FFD700] text-3xl animate-spin-slow" />
      ),
    },
    done: {
      bg: "bg-gradient-to-br from-[#22C55E] to-[#16a34a]", // Green for success
      border: "border-[#FFD700]", // Gold border
      icon: <FaCheckCircle className="text-[#FFD700] text-3xl" />, // Gold icon
    },
  };

  const { bg, border, icon } =
    sectionStyles[id] || {
      bg: "bg-gradient-to-br from-[#6B7280] to-[#9CA3AF]",
      border: "border-gray-500",
      icon: <FaTasks className="text-gray-400 text-3xl" />,
    };

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-start min-h-[60dvh] gap-y-6 p-6 rounded-3xl shadow-2xl w-full max-w-3xl border-2 my-5 transition-all transform backdrop-blur-lg ${
        isOver
          ? "scale-105 bg-gradient-to-br from-[#8b5cf6] to-[#14b8a6] border-[#FFD700]" // Highlight on drag
          : `${bg} ${border}`
      }`}
      
    >
      {/* Section Header */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="flex items-center gap-3"
      >
        {icon}
        <h1 className="text-3xl font-extrabold text-gray-50 tracking-wide">
          {title}
        </h1>
      </motion.div>

      {/* Task Cards */}
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard
            key={task.taskId}
            task={task}
            setRefetchTodo={setRefetchTodo}
          />
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center text-gray-200 mt-10"
        >
          <FaTasks className="text-6xl mb-3 animate-pulse text-gray-400" />
          <p className="text-lg font-medium">No tasks here yet!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DroppableSection;
