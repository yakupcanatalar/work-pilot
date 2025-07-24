import axios from "axios";
import CustomerDto from "../dtos/CustomerDto";

const API_URL = process.env.REACT_APP_API_URL;
const CUSTOMER_URL = `${API_URL}customer`;

const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken"); 
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

class CustomerService {

    async getAllCustomers(): Promise<CustomerDto[]> {
        try {
            const response = await axiosInstance.get(`${CUSTOMER_URL}`);
            const data = response.data as { content: any[] | { customers: any[] } };
            const customers = Array.isArray(data.content) ? data.content : (data.content as { customers: any[] }).customers; // Adjust this line based on your API response structure
            if (!Array.isArray(customers)) {
                throw new Error('Invalid response format: expected an array of customers');
            }
            return customers.map((customer: any) => new CustomerDto(
                customer.id,
                customer.user_id,
                customer.name,
                customer.phoneNumber,
                customer.email,
                customer.address,
                customer.note,
                customer.created_date,
                customer.updated_date
            ));
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    }

    async getCustomerById(customerId: string): Promise<CustomerDto> {
        try {
            const response = await axiosInstance.get(`${CUSTOMER_URL}/${customerId}`);
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
            console.error(`Error fetching customer with ID ${customerId}:`, error);
            throw error;
        }
    }

    async createCustomer(customerData: CustomerDto) {
        try {
            await axiosInstance.post(`${CUSTOMER_URL}`, customerData);
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    }

    async updateCustomer(customerId: number, customerData: CustomerDto) {
        try {
            await axiosInstance.put(`${CUSTOMER_URL}/${customerId}`, customerData);
        } catch (error) {
            console.error(`Error updating customer with ID ${customerId}:`, error);
            throw error;
        }
    }

    async deleteCustomer(customerId: number): Promise<void> {
        try {
            await axiosInstance.delete(`${CUSTOMER_URL}/${customerId}`);
        } catch (error) {
            console.error(`Error deleting customer with ID ${customerId}:`, error);
            throw error;
        }
    }

    async searchCustomers(searchText: string, name?: string, phoneNumber?: string, email?: string, page?: number, pageSize?: number): Promise<CustomerDto[]> {
        try {
            const response = await axiosInstance.get(`${CUSTOMER_URL}/search`, {
                params: {
                    q: searchText,
                    name,
                    phoneNumber,
                    email,
                    page,
                    pageSize
                }
            });
            const data = response.data as { content: any[] | { customers: any[] } };
            const customers = Array.isArray(data.content) ? data.content : (data.content as { customers: any[] }).customers; // Adjust this line based on your API response structure
            if (!Array.isArray(customers)) {
                throw new Error('Invalid response format: expected an array of customers');
            }
            return customers.map((customer: any) => new CustomerDto(
                customer.id,
                customer.user_id,
                customer.name,
                customer.phoneNumber,
                customer.email,
                customer.address,
                customer.note,
                customer.created_date,
                customer.updated_date
            ));
        } catch (error) {
            console.error(`Error searching customers with query ${searchText}:`, error);
            throw error;
        }
    }
}

export default new CustomerService();