import { useQuery } from "@tanstack/react-query"
import { userAPI } from "../services/api/userAPI"

export const useGetBlockedUsers = (userId, enabled = true) => {
    return useQuery({
        queryKey: ['blockedUsers'],
        queryFn: () => userAPI.getBlockedUsers(userId),
        enabled: !!userId && enabled,
        // staleTime: 1000 * 60 * 2,
        staleTime: Infinity,
        cacheTime: 1000 * 60 * 30,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};