import { useQuery } from "@tanstack/react-query"
import { userAPI } from "../services/api/userAPI"

export const useUserData = (userId) => {
    return useQuery({
        queryKey: ['userData', userId],
        queryFn: () => userAPI.getUserData(userId),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });
}