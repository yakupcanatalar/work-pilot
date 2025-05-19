import axios from "axios";

export const TaskStageRequestValidator = {
  TASK_STAGE_NAME_MIN_LENGTH: 3,
  TASK_STAGE_NAME_MAX_LENGTH: 50,
  NOTE_MAX_LENGTH: 250
};

export interface TaskStageDto {
  id?: number;
  name: string;
  note?: string;
}

export interface TaskStageCreateDto {
  name: string;
  note?: string;
}

export interface TaskStageUpdateDto {
  id: number;
  name: string;
  note?: string;
}

const API_URL = 'http://localhost:8080/api/v1/taskstage';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
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

// Get all stages
export const getAllTaskStages = async (): Promise<TaskStageDto[]> => {
  try {
    const response = await axiosInstance.get<TaskStageDto[]>("/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get stage by ID
export const getTaskStageById = async (id: number): Promise<TaskStageDto> => {
  try {
    const response = await axiosInstance.get<TaskStageDto>(`/${id}`);
    return response.data as TaskStageDto;
  } catch (error) {
    throw error;
  }
};

// Create new stage
export const createTaskStage = async (stage: TaskStageCreateDto): Promise<TaskStageDto> => {
  try {
    const response = await axiosInstance.post("/", stage);
    return response.data as TaskStageDto;
  } catch (error) {
    throw error;
  }
};

// Update stage
export const updateTaskStage = async (stage: TaskStageUpdateDto): Promise<TaskStageDto> => {
  try {
    const response = await axiosInstance.put(`/${stage.id}`, stage);
    return response.data as TaskStageDto;
  } catch (error) {
    throw error;
  }
};

// Delete stage
export const deleteTaskStage = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error) {
    throw error;
  }
};



export default {
  getAllTaskStages,
  getTaskStageById,
  createTaskStage,
  updateTaskStage,
  deleteTaskStage
};