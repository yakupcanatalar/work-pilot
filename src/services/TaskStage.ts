import axios from "axios";
import TaskStageDto, { TaskStageStatus } from "../dtos/TaskStageDto";

const API_URL = "http://137.184.83.58:8080/api/v1/";
//const API_URL = "http://localhost:8080/api/v1/";

const TASK_STAGE_URL = `${API_URL}task-stage`;

export const TaskStageRequestValidator = {
  TASK_STAGE_NAME_MIN_LENGTH: 3,
  TASK_STAGE_NAME_MAX_LENGTH: 50,
  NOTE_MAX_LENGTH: 250,
};

const axiosInstance = axios.create({
  baseURL: API_URL,
});

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

export const getAllTaskStages = async (): Promise<TaskStageDto[]> => {
  try {
    const response = await axiosInstance.get(TASK_STAGE_URL);
    const allStages = response.data as TaskStageDto[];
    return allStages.filter(stage => stage.status === TaskStageStatus.ACTIVE);
  } catch (error) {
    throw error;
  }
};

export const getTaskStageById = async (id: number): Promise<TaskStageDto> => {
  try {
    const response = await axiosInstance.get(`${TASK_STAGE_URL}/${id}`);
    return response.data as TaskStageDto;
  } catch (error) {
    throw error;
  }
};

export const createTaskStage = async (
  stageData: {
    name: string;
    note?: string;
  }
): Promise<TaskStageDto> => {
  try {
    const stageToCreate = {
      name: stageData.name,
      note: stageData.note,
      status: TaskStageStatus.ACTIVE
    };
    
    const response = await axiosInstance.post(TASK_STAGE_URL, stageToCreate);
    return response.data as TaskStageDto;
  } catch (error) {
    throw error;
  }
};

export const updateTaskStage = async (
  id: number,
  stageData: {
    name: string;
    note?: string;
  }
): Promise<TaskStageDto> => {
  try {
    const stageToUpdate = {
      name: stageData.name,
      note: stageData.note,
      status: TaskStageStatus.ACTIVE // Güncelleme sırasında status ACTIVE kalır
    };
    
    const response = await axiosInstance.put(
      `${TASK_STAGE_URL}/${id}`,
      stageToUpdate
    );
    return response.data as TaskStageDto;
  } catch (error) {
    throw error;
  }
};

export const deleteTaskStage = async (id: number): Promise<void> => {
  try {
    // Önce stage'i getir
    const stage = await getTaskStageById(id);
    
    const stageToUpdate = {
      name: stage.name,
      note: stage.note,
      status: TaskStageStatus.DELETED
    };
    
    await axiosInstance.put(`${TASK_STAGE_URL}/${id}`, stageToUpdate);
  } catch (error) {
    throw error;
  }
};

export const hardDeleteTaskStage = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${TASK_STAGE_URL}/${id}`);
  } catch (error) {
    throw error;
  }
};

export default {
  getAllTaskStages,
  getTaskStageById,
  createTaskStage,
  updateTaskStage,
  deleteTaskStage,
  hardDeleteTaskStage,
};