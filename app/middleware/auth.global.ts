import { useAuthStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {

    const path = to?.path || ''
    const isDashboardRoute = path.includes('/dashboard');
    const isAuthRoute = path.includes('/auth');
    const authStore = useAuthStore();
    const { accessToken, refreshToken } = authStore;

    if (accessToken && refreshToken) {
        await authStore.checkAndRefreshTokens();
    }

    if (isAuthRoute && accessToken && refreshToken) {
        return navigateTo('/dashboard');
    }

    if (isDashboardRoute && (!authStore.accessToken || !authStore.refreshToken)) {
        return navigateTo('/auth/login');
    }

    if (path === '/') {
        if (accessToken && refreshToken) {
            return navigateTo('/dashboard');
        } else {
            return navigateTo('/auth/login');
        }
    }
});
