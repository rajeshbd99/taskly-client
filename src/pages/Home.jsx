import { Helmet } from "react-helmet-async";
import { useContext, useState, useEffect } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DroppableSection from "../components/home/DroppableSection";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { AuthContext } from "../provider/AuthProvider";
import AddTaskModal from "../components/home/AddTaskModal";
import EditTaskModal from "../components/home/EditTaskModal";

const Home = () => {
  const [refetchTodo, setRefetchTodo] = useState(false);
  const [todoTask, setTodoTask] = useState([]);
  const [inProgressTask, setInProgressTask] = useState([]);
  const [doneTask, setDoneTask] = useState([]);
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  // Fetch tasks when user email is available
  useEffect(() => {
    if (user?.email) {
      axiosPublic.get(`/user/get-task/${user.email}`).then((response) => {
        const tasks = response.data;
        setTodoTask(tasks.filter((task) => task.status === "to-do"));
        setInProgressTask(tasks.filter((task) => task.status === "in-progress"));
        setDoneTask(tasks.filter((task) => task.status === "done"));
      });
    }
  }, [user?.email, axiosPublic, refetchTodo]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 300, tolerance: 5 },
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    // Find and update the task
    let movedTask = null;
    let updatedTodo = todoTask.filter((task) => {
      if (task.taskId === taskId) {
        movedTask = { ...task, status: newStatus };
        return false;
      }
      return true;
    });

    let updatedInProgress = inProgressTask.filter((task) => {
      if (task.taskId === taskId) {
        movedTask = { ...task, status: newStatus };
        return false;
      }
      return true;
    });

    let updatedDone = doneTask.filter((task) => {
      if (task.taskId === taskId) {
        movedTask = { ...task, status: newStatus };
        return false;
      }
      return true;
    });

    if (movedTask) {
      if (newStatus === "to-do") updatedTodo.push(movedTask);
      if (newStatus === "in-progress") updatedInProgress.push(movedTask);
      if (newStatus === "done") updatedDone.push(movedTask);
    }

    // Update frontend state
    setTodoTask(updatedTodo);
    setInProgressTask(updatedInProgress);
    setDoneTask(updatedDone);

    // Update backend with new status
    try {
      await axiosPublic.patch(`/user/edit-task/${user.email}/${taskId}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  return (
    <div className="bg-[#121212] text-gray-300 min-h-screen p-6">
      <Helmet>
        <title>TaskHandler</title>
      </Helmet>

      <h1 className="text-4xl font-bold text-center mb-6 text-[#FFD700]">
        Task Management Board
      </h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 justify-items-center gap-6">
          <DroppableSection
            setRefetchTodo={setRefetchTodo}
            id="to-do"
            title="To-Do"
            tasks={todoTask}
          />
          <DroppableSection
            setRefetchTodo={setRefetchTodo}
            id="in-progress"
            title="In Progress"
            tasks={inProgressTask}
          />
          <DroppableSection
            setRefetchTodo={setRefetchTodo}
            id="done"
            title="Done"
            tasks={doneTask}
          />
        </div>
      </DndContext>

      {/* Add Task Modal */}
      <AddTaskModal setRefetchTodo={setRefetchTodo} />
      {/* Edit Task Modal */}
      <EditTaskModal setRefetchTodo={setRefetchTodo} />
    </div>
  );
};

export default Home;
