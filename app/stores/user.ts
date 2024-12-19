import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', () =>{
    const user = ref({})

    const reset = () => {
        user.value = {}
    }

    const setUser = (data: any) => {
        user.value = data
    }

    const getUser = () => {
        return user.value
    }

    return { setUser, reset, user }

})