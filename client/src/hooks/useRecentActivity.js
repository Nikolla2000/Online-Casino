import { useQuery } from "@tanstack/react-query"
import { userAPI } from "../services/api/userAPI"

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recentActivity'],
    queryFn: userAPI.getRecentActivity,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  })
}