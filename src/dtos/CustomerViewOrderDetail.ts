export interface CustomerViewOrderDetail {
    userCompany: string;
    userEmail: string;
    customerName: string;
    taskName: string;
    stages: string[] | null;
    currentStage: string | null;
    status: OrderStatus;
    createdDate: number;
    updatedDate: number;
}

export enum OrderStatus {
    CREATED = 'CREATED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}
