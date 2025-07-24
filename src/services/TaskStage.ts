import TaskStageDto, { TaskStageStatus } from "../dtos/TaskStageDto";
import { useAxios } from "../utils/TokenService";

export const TaskStageRequestValidator = {
  TASK_STAGE_NAME_MIN_LENGTH: 3,
  TASK_STAGE_NAME_MAX_LENGTH: 50,
  NOTE_MAX_LENGTH: 250,
};

const TASK_STAGE_URL = "/task-stage";

export const useTaskStageService = () => {
  const axiosInstance = useAxios();

  const getAllTaskStages = async (): Promise<TaskStageDto[]> => {
    const response = await axiosInstance.get(TASK_STAGE_URL);
    const allStages = response.data as TaskStageDto[];
    return allStages.filter(stage => stage.status === TaskStageStatus.ACTIVE);
  };

  const getTaskStageById = async (id: number): Promise<TaskStageDto> => {
    const response = await axiosInstance.get(`${TASK_STAGE_URL}/${id}`);
    return response.data as TaskStageDto;
  };

  const createTaskStage = async (
    stageData: {
      name: string;
      note?: string;
    }
  ): Promise<TaskStageDto> => {
    const stageToCreate = {
      name: stageData.name,
      note: stageData.note,
      status: TaskStageStatus.ACTIVE
    };
    const response = await axiosInstance.post(TASK_STAGE_URL, stageToCreate);
    return response.data as TaskStageDto;
  };

  const updateTaskStage = async (
    id: number,
    stageData: {
      name: string;
      note?: string;
    }
  ): Promise<TaskStageDto> => {
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
  };

  const deleteTaskStage = async (id: number): Promise<void> => {
    // Önce stage'i getir
    const stage = await getTaskStageById(id);
    const stageToUpdate = {
      name: stage.name,
      note: stage.note,
      status: TaskStageStatus.DELETED
    };
    await axiosInstance.put(`${TASK_STAGE_URL}/${id}`, stageToUpdate);
  };

  const hardDeleteTaskStage = async (id: number): Promise<void> => {
    await axiosInstance.delete(`${TASK_STAGE_URL}/${id}`);
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