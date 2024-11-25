import {useAuthStore} from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
    const useAuth = useAuthStore()

    if (to.fullPath.includes('/auth') && useAuth.authenticated) {
        return navigateTo('/dashboard')
    }

    if (to.fullPath.includes('/dashboard')  && !useAuth.authenticated) {
        console.log(to.path)
        return navigateTo('/auth/login')
    }
})