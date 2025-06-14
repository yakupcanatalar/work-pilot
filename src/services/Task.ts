interface Task {
  id: number;
  userId: number;
  name: string;
  note?: string;
  stages: TaskStageDto[];
}

interface TaskStageDto {
  id: number;
  name: string;
}


export default Task;