import { useDraggable } from "@dnd-kit/core";

const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.taskId,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="card w-96 bg-base-100 shadow-sm p-4 cursor-grab"
    >
      <h2 className="text-lg font-semibold">{task.description}</h2>
      <h2 className="text-md font-semibold text-green-400">{task.status}</h2>
    </div>
  );
};

export default TaskCard;
