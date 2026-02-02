import { useQuery } from "@tanstack/react-query"
import { userAPI } from "../services/api/userAPI"

export const useUserData = () => {
    return useQuery({
        queryKey: ['userData'],
        queryFn: userAPI.getUserData,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });
}