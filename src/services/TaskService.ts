import axios from "axios";

//const API_URL = "http://137.184.83.58:8080/api/v1/";
const API_URL = "http://localhost:8080/api/v1/";

const TASK_URL = `${API_URL}task`;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Adjust this to where you store your token
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createTask = async (taskData: { name: string; note: string; stageIds: number[] }) => {
  try {
    const response = await axiosInstance.post(TASK_URL, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTasks = async () => {
  try {
    const response = await axiosInstance.get(TASK_URL);
    const tasks = (response.data as any[]).map((task: any) => {
      let nodes;
      try {
        nodes = JSON.parse(task.note);
      } catch (e) {
        nodes = task.note; // or handle the error as needed
      }
      return {
        ...task,
        nodes,
      };
    });
    return tasks;
  } catch (error) {
    throw error;
  }
};

export const getTaskById = async (taskId: number) => {
  try {
    const response = await axiosInstance.get(`${TASK_URL}/${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTaskById = async (taskId: number) => {
  try {
    const response = await axiosInstance.delete(`${TASK_URL}/${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTaskById = async (taskId: number, taskData: { name: string; note: string; stageIds: number[] }) => {
  try {
    const response = await axiosInstance.put(`${TASK_URL}/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};