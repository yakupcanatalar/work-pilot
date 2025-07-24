import { OrderSearchRequest, PageResult, Order, OrderDetail, CreateOrderRequest, ActiveOrder } from "../dtos/OrderDto";
import { useAxios } from "../utils/TokenService";
import { ErrorMessage } from "../utils/ErrorMessage";

export const useOrderService = () => {
  const axiosInstance = useAxios();
  const ORDER_URL = "/order";

  const searchOrders = async (
    searchRequest: OrderSearchRequest
  ): Promise<PageResult<Order, OrderDetail>> => {
    try {
      const response = await axiosInstance.get<PageResult<Order, OrderDetail>>(
        ORDER_URL,
        { params: searchRequest }
      );
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const createOrder = async (
    orderData: CreateOrderRequest
  ): Promise<void> => {
    try {
      await axiosInstance.post(ORDER_URL, orderData);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const getOrderById = async (orderId: number): Promise<OrderDetail> => {
    try {
      const response = await axiosInstance.get<OrderDetail>(
        `${ORDER_URL}/${orderId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const startOrder = async (orderId: number): Promise<void> => {
    try {
      await axiosInstance.put(`${ORDER_URL}/${orderId}/start`);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const cancelOrder = async (orderId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`${ORDER_URL}/${orderId}/cancel`);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const completeOrder = async (orderId: number): Promise<void> => {
    try {
      await axiosInstance.put(`${ORDER_URL}/${orderId}/complete`);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const revertOrder = async (orderId: number): Promise<void> => {
    try {
      await axiosInstance.put(`${ORDER_URL}/${orderId}/revert`);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const moveToNextStage = async (orderId: number): Promise<void> => {
    try {
      await axiosInstance.put(`${ORDER_URL}/${orderId}/next-stage`);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const moveToPreviousStage = async (orderId: number): Promise<void> => {
    try {
      await axiosInstance.put(`${ORDER_URL}/${orderId}/previous-stage`);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
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