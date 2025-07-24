import axios from "axios";
import { OrderSearchRequest, PageResult, Order, OrderDetail, CreateOrderRequest, ActiveOrder } from "../dtos/OrderDto";

const API_URL = process.env.REACT_APP_API_URL;
const ORDER_URL = `${API_URL}order`;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Adjust this to where you store your token
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const searchOrders = async (
  searchRequest: OrderSearchRequest
): Promise<PageResult<Order, OrderDetail>> => {
  try {
    const response = await axiosInstance.get<PageResult<Order, OrderDetail>>(
      ORDER_URL,
      {
        params: searchRequest,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (
  orderData: CreateOrderRequest
): Promise<void> => {
  try {
    await axiosInstance.post(ORDER_URL, orderData);
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (orderId: number): Promise<OrderDetail> => {
  try {
    const response = await axiosInstance.get<OrderDetail>(
      `${ORDER_URL}/${orderId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};




export const startOrder = async (orderId: number): Promise<void> => {
  try {
    await axiosInstance.put(`${ORDER_URL}/${orderId}/start`);
  } catch (error) {
    throw error;
  }
};

export const cancelOrder = async (orderId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${ORDER_URL}/${orderId}/cancel`);
  } catch (error) {
    throw error;
  }
};

export const completeOrder = async (orderId: number): Promise<void> => {
  try {
    await axiosInstance.put(`${ORDER_URL}/${orderId}/complete`);
  } catch (error) {
    throw error;
  }
};

export const revertOrder = async (orderId: number): Promise<void> => {
  try {
    await axiosInstance.put(`${ORDER_URL}/${orderId}/revert`);
  } catch (error) {
    throw error;
  }
};

export const moveToNextStage = async (orderId: number): Promise<void> => {
  try {
    await axiosInstance.put(`${ORDER_URL}/${orderId}/next-stage`);
  } catch (error) {
    throw error;
  }
};

export const moveToPreviousStage = async (orderId: number): Promise<void> => {
  try {
    await axiosInstance.put(`${ORDER_URL}/${orderId}/previous-stage`);
  } catch (error) {
    throw error;
  }
};