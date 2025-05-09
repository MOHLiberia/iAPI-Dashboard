import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', () =>{
    const user = ref({})

    const reset = () => {
        user.value = {}
    }

    return { user, reset }
}, {
    persist: {
        storage: localStorage,
        pick: ['user'],
    }
})