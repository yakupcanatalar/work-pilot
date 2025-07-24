import { OrderSearchRequest, PageResult, Order, OrderDetail, CreateOrderRequest, ActiveOrder } from "../dtos/OrderDto";
import { useAxios } from "../utils/TokenService";

// API_URL ve ORDER_URL artık useAxios içinde yönetilecek

export const useOrderService = () => {
  const axiosInstance = useAxios();
  const ORDER_URL = "/order";

  const searchOrders = async (
    searchRequest: OrderSearchRequest
  ): Promise<PageResult<Order, OrderDetail>> => {
    const response = await axiosInstance.get<PageResult<Order, OrderDetail>>(
      ORDER_URL,
      { params: searchRequest }
    );
    return response.data;
  };

  const createOrder = async (
    orderData: CreateOrderRequest
  ): Promise<void> => {
    await axiosInstance.post(ORDER_URL, orderData);
  };

  const getOrderById = async (orderId: number): Promise<OrderDetail> => {
    const response = await axiosInstance.get<OrderDetail>(
      `${ORDER_URL}/${orderId}`
    );
    return response.data;
  };

  const startOrder = async (orderId: number): Promise<void> => {
    await axiosInstance.put(`${ORDER_URL}/${orderId}/start`);
  };

  const cancelOrder = async (orderId: number): Promise<void> => {
    await axiosInstance.delete(`${ORDER_URL}/${orderId}/cancel`);
  };

  const completeOrder = async (orderId: number): Promise<void> => {
    await axiosInstance.put(`${ORDER_URL}/${orderId}/complete`);
  };

  const revertOrder = async (orderId: number): Promise<void> => {
    await axiosInstance.put(`${ORDER_URL}/${orderId}/revert`);
  };

  const moveToNextStage = async (orderId: number): Promise<void> => {
    await axiosInstance.put(`${ORDER_URL}/${orderId}/next-stage`);
  };

  const moveToPreviousStage = async (orderId: number): Promise<void> => {
    await axiosInstance.put(`${ORDER_URL}/${orderId}/previous-stage`);
  };

  return {
    searchOrders,
    createOrder,
    getOrderById,
    startOrder,
    cancelOrder,
    completeOrder,
    revertOrder,
    moveToNextStage,
    moveToPreviousStage,
  };
};