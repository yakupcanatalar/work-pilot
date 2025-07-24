import TaskStageDto, { TaskStageStatus } from "../dtos/TaskStageDto";
import { useAxios } from "../utils/TokenService";
import { ErrorMessage } from "../utils/ErrorMessage";

export const TaskStageRequestValidator = {
  TASK_STAGE_NAME_MIN_LENGTH: 3,
  TASK_STAGE_NAME_MAX_LENGTH: 50,
  NOTE_MAX_LENGTH: 250,
};

const TASK_STAGE_URL = "/task-stage";

export const useTaskStageService = () => {
  const axiosInstance = useAxios();

  const getAllTaskStages = async (): Promise<TaskStageDto[]> => {
    try {
      const response = await axiosInstance.get(TASK_STAGE_URL);
      const allStages = response.data as TaskStageDto[];
      return allStages.filter(stage => stage.status === TaskStageStatus.ACTIVE);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const getTaskStageById = async (id: number): Promise<TaskStageDto> => {
    try {
      const response = await axiosInstance.get(`${TASK_STAGE_URL}/${id}`);
      return response.data as TaskStageDto;
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const createTaskStage = async (
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
      throw new Error(ErrorMessage.get(error));
    }
  };

  const updateTaskStage = async (
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
      throw new Error(ErrorMessage.get(error));
    }
  };

  const deleteTaskStage = async (id: number): Promise<void> => {
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
      throw new Error(ErrorMessage.get(error));
    }
  };

  const hardDeleteTaskStage = async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`${TASK_STAGE_URL}/${id}`);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  return {
    getAllTaskStages,
    getTaskStageById,
    createTaskStage,
    updateTaskStage,
    deleteTaskStage,
    hardDeleteTaskStage,
  };
};