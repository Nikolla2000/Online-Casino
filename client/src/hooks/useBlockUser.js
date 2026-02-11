import { useMutation, useQueryClient } from "@tanstack/react-query"
import { userAPI } from "../services/api/userAPI";

export const useBlockUser = (userId) => {
    const queryClient = useQueryClient();
    
    const blockMutation = useMutation({
        mutationFn: () => userAPI.blockUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(['user', userId]);
            queryClient.invalidateQueries(['blockedUsers']);
        },
        onError: (error) => {
            console.error('Block error: ', error);
        }
    });

    const unblockMutation = useMutation({
        mutationFn: () => userAPI.unblockUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(['user', userId]);
            queryClient.invalidateQueries(['blockedUsers']);
        },
        onError: (error) => {
            console.error('Unblock error: ', error);
        }
    });

    return {
        blockUser: blockMutation.mutate,
        unblockUser: unblockMutation.mutate,
        isBlocking: blockMutation.isPending,
        isUnblocking: unblockMutation.isPending,
        isLoading: blockMutation.isPending || unblockMutation.isPending,
        blockError: blockMutation.error,
        unblockError: unblockMutation.error
      };
};