import { useAxios } from "../utils/TokenService";
import { ErrorMessage } from "../utils/ErrorMessage";

const TASK_URL = "/task";

export const useTaskService = () => {
  const axiosInstance = useAxios();

  const createTask = async (taskData: { name: string; note: string; stageIds: number[] }) => {
    try {
      const response = await axiosInstance.post(TASK_URL, taskData);
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const getTasks = async () => {
    try {
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
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const getTaskById = async (taskId: number) => {
    try {
      const response = await axiosInstance.get(`${TASK_URL}/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const deleteTaskById = async (taskId: number) => {
    try {
      const response = await axiosInstance.delete(`${TASK_URL}/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const updateTaskById = async (taskId: number, taskData: { name: string; note: string; stageIds: number[] }) => {
    try {
      const response = await axiosInstance.put(`${TASK_URL}/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  return {
    createTask,
    getTasks,
    getTaskById,
    deleteTaskById,
    updateTaskById,
  };
};