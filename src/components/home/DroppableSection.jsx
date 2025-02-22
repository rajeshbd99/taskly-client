import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

const DroppableSection = ({ id, title, tasks, setRefetchTodo }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col items-center justify-start min-h-[50dvh] gap-y-5 p-4 bg-gray-100 rounded-lg shadow-xl min-w-96 border-2 border-gray-300 my-5  ${
        isOver ? "bg-indigo-200" : ""
      }`}
    >
      <h1 className="text-2xl font-semibold text-indigo-800">{title}</h1>
      {tasks.map((task) => (
        <TaskCard
          key={task.taskId}
          task={task}
          setRefetchTodo={setRefetchTodo}
        />
      ))}
    </div>
  );
};

export default DroppableSection;
