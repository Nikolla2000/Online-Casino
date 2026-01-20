import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrentUser, refresh } from "../redux/features/auth/authSlice";

export const useAuthInitialization = () => {
    const dispatch = useDispatch();
    const { accessToken, user, status } = useSelector((state) => state.auth);
    const isInitialized = useRef(false); // Предотвратява многократни извиквания
    const isLoading = useRef(false);

    useEffect(() => {
        if (isInitialized.current || user || status === 'loading' || isLoading.current) {
            return;
        }

        const initializeAuth = async () => {
            isLoading.current = true;
            isInitialized.current = true;
            
            try {
                const resultAction = await dispatch(refresh());
                if (refresh.fulfilled.match(resultAction)) {
                    const token = resultAction.payload.accessToken;

                    if (token) {
                        await dispatch(fetchCurrentUser(token));
                    }
                }
            } catch (err) {
                console.error('Refresh failed: ', err);
            } finally {
                isLoading.current = false;
            }
        }

        initializeAuth();
    }, [dispatch, user]);
}