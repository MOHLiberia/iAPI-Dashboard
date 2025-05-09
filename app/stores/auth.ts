import { defineStore } from 'pinia'
import { useUserStore } from "./user";

export const useAuthStore = defineStore('auth', () => {
    const config = useRuntimeConfig()
    const toastService = usePVToastService()
    const useUser = useUserStore()

    const accessToken = useCookie('access_token', {maxAge: 60 * 60})
    const refreshToken = useCookie('refresh_token', {maxAge: 6 * 60 * 60})

    const countdownInterval = ref()

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
                setTokens({ accessToken: res.data?.accessToken, refreshToken: res.data?.refreshToken })
                useUser.user = res.data?.user
                authenticated.value = true
                toastService.add({
                    severity: 'success',
                    summary: res.status || 'Success',
                    detail: res.message,
                    life: 5000,
                })
                await navigateTo('/dashboard')
                return
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
        pending.value = true
        await $fetch(`${config.public.apiUrl}/auth/logout`, {
            method: 'POST',
            headers: {
                'api-key': config.public.apiKey.toString(),
                'content-type': 'application/json',
                'authorization': `Bearer ${accessToken.value}`
            },
        })
            .then(async (res: any) => {
                authenticated.value = false
                await resetTokens()
                toastService.add({
                    severity: 'success',
                    summary: res.status,
                    detail: res.message || 'Something went wrong. If this continues, please get in touch with the ICT Unit.',
                    life: 5000,
                })
                await navigateTo('/auth/login')
            })
            .catch((err) => {
                toastService.add({
                    severity: 'error',
                    summary: err.data?.status || 'Error',
                    detail: err.data?.message || 'Something went wrong. If this continues, please get in touch with the ICT Unit.',
                    life: 5000,
                })
            }).finally(async () => {
                useUser.reset()
                pending.value = false
            })
    }

    const refreshAccessToken = async () => {
        await $fetch(`${config.public.apiUrl}/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'api-key': config.public.apiKey.toString(),
                'content-type': 'application/json',
                'authorization': `Bearer ${accessToken.value}`
            },
        })
            .then(async (res: any) => {
                setTokens({accessToken: res.data?.accessToken, refreshToken: res.data?.refreshToken})
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

    const checkAndRefreshTokens = async () => {
        if (!accessToken.value) {
            await resetTokens();
            return;
        }

        if (!refreshToken.value) {
            await resetTokens();
            return;
        }

        if (!accessToken.value) {
            await refreshAccessToken();
        }
    }

    const setTokens = (tokens: { accessToken: string; refreshToken: string }) => {
        accessToken.value = tokens.accessToken
        refreshToken.value = tokens.refreshToken

        startCountdown()
    }

    const resetTokens = async () => {
        accessToken.value = null
        refreshToken.value = null

        clearInterval(countdownInterval.value)

        await navigateTo('auth/login')
    }

    const startCountdown = () => {
        if (countdownInterval.value) {
            clearInterval(countdownInterval.value)
        }

        countdownInterval.value = setInterval(async () => {
           await checkAndRefreshTokens()
        }, 60 * 1000)
    }

    return {authenticated, pending, accessToken, refreshToken, login, logout, refreshAccessToken, checkAndRefreshTokens}
}, {
    persist: {
        storage: localStorage,
        pick: ['authenticated'],
    },
})

