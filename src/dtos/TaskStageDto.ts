export enum TaskStageStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED'
}

class TaskStageDto {
  id?: number;
  userId: number;
  name: string;
  status: TaskStageStatus;
  note?: string;

  constructor(
    id: number | undefined,
    userId: number,
    name: string,
    status: TaskStageStatus,
    note?: string
  ) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.status = status;
    this.note = note;
  }
}

export default TaskStageDto;