import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrentUser, refresh } from "../redux/features/auth/authSlice";

export const useAuthInitialization = () => {
    const dispatch = useDispatch();
    const { accessToken, user, status } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) return;

        if (status === 'loading') return;

        const initializeAuth = async () => {
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
            }
        }

        initializeAuth();
    }, [dispatch, user, status]);
}