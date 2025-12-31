import { useQuery } from "@tanstack/react-query"
import { userAPI } from "../services/api/userAPI"

export const useGameHistory = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['gameHistory', page, limit],
        queryFn: async () => { userAPI.getGameHisory(page, limit) },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 2,
    });
};