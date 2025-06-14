import TaskStageDto from "./TaskStageDto";

class TaskDto {
  id?: number;
  userId?: number;
  name: string;
  note?: string;
  stages: TaskStageDto[];

  constructor(
  id: number | 0,
  userId: number | undefined,
  name: string,
  note: string | undefined,
  stages: TaskStageDto[]
) {
  this.id = id;
  this.userId = userId;
  this.name = name;
  this.note = note;
  this.stages = stages;
}
}





export default TaskDto;