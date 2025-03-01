import { defineStore } from 'pinia'
import { useUserStore } from "./user";

export const useAuthStore = defineStore('auth', () => {
    const config = useRuntimeConfig()
    const toastService = usePVToastService()
    const user = useUserStore()

    const accessToken = useCookie('access_token')
    const refreshToken = useCookie('refresh_token')

    const authenticated = ref(false)
    const pending = ref(false)

    const login = async ({usernameOrEmail, password}: { usernameOrEmail: string; password: string }) => {
        pending.value = true
        await $fetch(`${config.public.apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'api-key': config.public.apiKey.toString(),
                'content-type': 'application/json'
            },
            body: JSON.stringify({usernameOrEmail, password}),
        })
            .then(async (res: any) => {
                accessToken.value = res.data?.accessToken
                refreshToken.value = res.data?.refreshToken
                user.setUser(res.data?.user)
                authenticated.value = true
                await navigateTo('/dashboard')
            })
            .catch((err) => {
                toastService.add({
                    severity: 'error',
                    summary: err.data?.status || 'Error',
                    detail: err.data?.message || 'Something went wrong. If this continues, please get in touch with the ICT Unit.',
                    life: 5000,
                })
            })
            .finally(() => {
                pending.value = false
            })
    }

    const logout = async () => {
        await $fetch(`${config.public.apiUrl}/auth/logout`, {
            method: 'POST',
            headers: {
                'api-key': config.public.apiKey.toString(),
                'content-type': 'application/json',
                'authorization': `Bearer ${user.accessToken}`
            },
        })
            .then(async () => {
                user.reset()
                authenticated.value = false
                await navigateTo('/login')
            })
            .catch((err) => {
                toastService.add({
                    severity: 'error',
                    summary: err.data?.status || 'Error',
                    detail: err.data?.message || 'Something went wrong. If this continues, please get in touch with the ICT Unit.',
                    life: 5000,
                })
            })
    }

    return {login, authenticated, pending, logout}
}, {
    // persist: true,
})

