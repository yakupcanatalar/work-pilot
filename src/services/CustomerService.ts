import { useAxios } from "../utils/TokenService";
import { ErrorMessage } from "../utils/ErrorMessage";
import CustomerDto from "../dtos/CustomerDto";

const CUSTOMER_PATH = "/customer";

export const useCustomerService = () => {
  const axiosInstance = useAxios();

  const getAllCustomers = async (): Promise<CustomerDto[]> => {
    try {
      const response = await axiosInstance.get(`${CUSTOMER_PATH}`);
      const data = response.data as { content: any[] | { customers: any[] } };
      const customers = Array.isArray(data.content)
        ? data.content
        : (data.content as { customers: any[] }).customers;
      if (!Array.isArray(customers)) {
        throw new Error(
          "Invalid response format: expected an array of customers"
        );
      }
      return customers.map(
        (customer: any) =>
          new CustomerDto(
            customer.id,
            customer.user_id,
            customer.name,
            customer.phoneNumber,
            customer.email,
            customer.address,
            customer.note,
            customer.created_date,
            customer.updated_date
          )
      );
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const getCustomerById = async (customerId: string): Promise<CustomerDto> => {
    try {
      const response = await axiosInstance.get(`${CUSTOMER_PATH}/${customerId}`);
      const customer = (response.data as { content: any }).content;
      return new CustomerDto(
        customer.id,
        customer.user_id,
        customer.name,
        customer.phoneNumber,
        customer.email,
        customer.address,
        customer.note,
        customer.created_date,
        customer.updated_date
      );
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const createCustomer = async (customerData: CustomerDto) => {
    try {
      await axiosInstance.post(`${CUSTOMER_PATH}`, customerData);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const updateCustomer = async (
    customerId: number,
    customerData: CustomerDto
  ) => {
    try {
      await axiosInstance.put(`${CUSTOMER_PATH}/${customerId}`, customerData);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const deleteCustomer = async (customerId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`${CUSTOMER_PATH}/${customerId}`);
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  const searchCustomers = async (
    searchText: string,
    name?: string,
    phoneNumber?: string,
    email?: string,
    page?: number,
    pageSize?: number
  ): Promise<CustomerDto[]> => {
    try {
      const response = await axiosInstance.get(`${CUSTOMER_PATH}/search`, {
        params: {
          q: searchText,
          name,
          phoneNumber,
          email,
          page,
          pageSize,
        },
      });
      const data = response.data as { content: any[] | { customers: any[] } };
      const customers = Array.isArray(data.content)
        ? data.content
        : (data.content as { customers: any[] }).customers;
      if (!Array.isArray(customers)) {
        throw new Error(
          "Invalid response format: expected an array of customers"
        );
      }
      return customers.map(
        (customer: any) =>
          new CustomerDto(
            customer.id,
            customer.user_id,
            customer.name,
            customer.phoneNumber,
            customer.email,
            customer.address,
            customer.note,
            customer.created_date,
            customer.updated_date
          )
      );
    } catch (error) {
      throw new Error(ErrorMessage.get(error));
    }
  };

  return {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
  };
};