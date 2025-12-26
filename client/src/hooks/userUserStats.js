import { useQuery } from '@tanstack/react-query';
import { userAPI } from '../services/api/userAPI';

export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: userAPI.getUserStats,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  })
}