interface Task {
  id: number;
  userId: number;
  name: string;
  note?: string;
  stages: TaskStageDto[];
}

interface TaskStageDto {
  // Define fields as needed, e.g.:
  id: number;
  name: string;
}


export default Task;