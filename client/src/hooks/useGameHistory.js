import { useQuery } from "@tanstack/react-query"
import { userAPI } from "../services/api/userAPI"

export const useGameHistory = (page = 1, limit = 10, enabled = true) => {
    return useQuery({
        queryKey: ['gameHistory', page, limit],
        queryFn: () => userAPI.getGameHisory(page, limit),
        enabled: enabled,
        keepPreviousData: true,
        staleTime: 1000 * 60 * 2,
    });
};