import { createBrowserRouter } from "react-router";
import Welcome from "./screens/Welcome";
import MeetClorb from "./screens/MeetClorb";
import TaskSelect from "./screens/TaskSelect";
import TimeSelect from "./screens/TimeSelect";
import ExecutionRoom from "./screens/ExecutionRoom";
import Reward from "./screens/Reward";
import Funeral from "./screens/Funeral";
import TodoList from "./screens/TodoList";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/meet",
    Component: MeetClorb,
  },
  {
    path: "/todo",
    Component: TodoList,
  },
  {
    path: "/task-select/:task",
    Component: TaskSelect,
  },
  {
    path: "/time-select/:task",
    Component: TimeSelect,
  },
  {
    path: "/room/:task",
    Component: ExecutionRoom,
  },
  {
    path: "/reward",
    Component: Reward,
  },
  {
    path: "/funeral",
    Component: Funeral,
  },
]);
