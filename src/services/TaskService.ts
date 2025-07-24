import { useAxios } from "../utils/TokenService";

const TASK_URL = "/task";

export const useTaskService = () => {
  const axiosInstance = useAxios();

  const createTask = async (taskData: { name: string; note: string; stageIds: number[] }) => {
    const response = await axiosInstance.post(TASK_URL, taskData);
    return response.data;
  };

  const getTasks = async () => {
    const response = await axiosInstance.get(TASK_URL);
    const tasks = (response.data as any[]).map((task: any) => {
      let nodes;
      try {
        nodes = JSON.parse(task.note);
      } catch (e) {
        nodes = task.note;
      }
      return {
        ...task,
        nodes,
      };
    });
    return tasks;
  };

  const getTaskById = async (taskId: number) => {
    const response = await axiosInstance.get(`${TASK_URL}/${taskId}`);
    return response.data;
  };

  const deleteTaskById = async (taskId: number) => {
    const response = await axiosInstance.delete(`${TASK_URL}/${taskId}`);
    return response.data;
  };

  const updateTaskById = async (taskId: number, taskData: { name: string; note: string; stageIds: number[] }) => {
    const response = await axiosInstance.put(`${TASK_URL}/${taskId}`, taskData);
    return response.data;
  };

  return {
    createTask,
    getTasks,
    getTaskById,
    deleteTaskById,
    updateTaskById,
      };
};