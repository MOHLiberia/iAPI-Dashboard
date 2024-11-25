import { defineStore } from 'pinia'
import {useUserStore} from "~/stores/user";

interface LoginCredentials {
    usernameOrEmail: string;
    password: string;
}

export const useAuthStore = defineStore('auth', () => {
    const config = useRuntimeConfig()
    const toastService = usePVToastService()
    const useUser = useUserStore()

    const accessToken = useCookie('access-token')
    const refreshToken = useCookie('refresh-token')


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
            ignoreResponseErrors: true,
            body: JSON.stringify({usernameOrEmail, password}),
        })
            .then(async (res) => {
                // useUser.user = res.data?.
                console.log(res.data)
                accessToken.value = res.data?.accessToken
                refreshToken.value = res.data?.refreshToken
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

    return {login, authenticated, pending}
})

