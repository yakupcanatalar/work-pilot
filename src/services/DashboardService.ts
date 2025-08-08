import { useAxios } from "../utils/TokenService";
import { ErrorMessage } from "../utils/ErrorMessage";
import DashboardSummaryDto from "../dtos/DashboardSummaryDto";

const DASHBOARD_PATH = "/dashboard";

export const useDashboardService = () => {
    const axiosInstance = useAxios();

    const getDashboardSummary = async (): Promise<DashboardSummaryDto> => {
        try {
            const response = await axiosInstance.get(`${DASHBOARD_PATH}/summary`);
            return response.data as DashboardSummaryDto;
        } catch (error) {
            throw new Error(ErrorMessage.get(error));
        }
    };

    return {
        getDashboardSummary,
    };
};