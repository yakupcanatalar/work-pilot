import axios from 'axios';
import { useCallback } from 'react';
import { CustomerViewOrderDetail } from '../dtos/CustomerViewOrderDetail';

export const useCustomerOrderService = () => {
    const getOrderByToken = useCallback(async (token: string): Promise<CustomerViewOrderDetail> => {
        try {
            const apiUrl = `http://localhost:8080/api/v1/customer-order/${token}`;

            const response = await axios.get<CustomerViewOrderDetail>(
                apiUrl,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    timeout: 10000, // 10 saniye timeout
                }
            );


            return response.data;
        } catch (error: any) {


            if (error.code === 'ECONNABORTED') {
                throw new Error('API istek zaman aşımına uğradı. Lütfen tekrar deneyin.');
            }

            if (error.message === 'Network Error') {
                throw new Error('Backend sunucusuna bağlanılamıyor. Lütfen sunucunun çalıştığından emin olun.');
            }

            if (error.response) {
                // Backend'den hata response'u geldi
                const status = error.response.status;
                const data = error.response.data;



                if (status === 404) {
                    throw new Error(`Sipariş bulunamadı. HTTP ${status} - ${JSON.stringify(data)}`);
                } else if (status === 500) {
                    throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
                } else {
                    throw new Error(data?.message || `HTTP ${status}: ${data || 'Bilinmeyen hata'}`);
                }
            } else if (error.request) {
                // İstek yapıldı ama response alınamadı
                throw new Error('Sunucudan yanıt alınamadı. Lütfen internet bağlantınızı kontrol edin.');
            } else {
                // Diğer hatalar
                throw new Error(error.message || 'Bilinmeyen bir hata oluştu.');
            }
        }
    }, []);

    return {
        getOrderByToken,
    };
};
