import TaskStageDto from "./TaskStageDto";

export interface CreateOrderRequest {
  customerId: number;
  taskId: number;
}

export interface OrderSearchRequest {
  customerId?: number;
  taskId?: number;
  task_current_stage_id?: number;
  status?: OrderStatus;
  page?: number;
  pageSize?: number;
}

export enum OrderStatus {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface CustomerSimpleDto {
  id: number;
  name: string;
}

export interface TaskSimpleDto {
  id: number;
  name: string;
}

export interface TaskStageSimpleDto {
  id: number;
  name: string;
  order: number;
}

export interface OrderDetail {
  id: number;
  userId: number;
  customer: CustomerSimpleDto;
  task: TaskSimpleDto;
  currentTaskStage: TaskStageSimpleDto | null;
  status: OrderStatus;
  hasNextStage: boolean;
  createdDate: number;
  updatedDate: number;
  taskStages: TaskStageDto[];
}

export interface Order {
  id: number;
  userId: number;
  customerId: number;
  taskId: number;
  taskCurrentStageId: number | null;
  status: OrderStatus;
  hasNextStage: boolean;
  token: string;
  createdDate: number;
  updatedDate: number;
}

export interface PageResult<T, D> {
  content: D[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ActiveOrder {
  id: number;
  taskId: number;
  taskName: string;
  status: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}