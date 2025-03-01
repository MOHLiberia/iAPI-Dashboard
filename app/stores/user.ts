import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', () =>{
    const user = ref({})
    const accessToken = useCookie('access_token')
    const refreshToken = useCookie('refresh_token')

    const reset = () => {
        user.value = {}
    }

    const setUser = (data: any) => {
        user.value = data
    }

    const getUser = () => {
        return user.value
    }

    return { setUser, reset, getUser, accessToken, refreshToken }
})