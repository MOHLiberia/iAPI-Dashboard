import {useToast} from "primevue/usetoast";

export const usePVToastService = () => {
    const nuxtApp = useNuxtApp();
    const getToast: typeof useToast = () => nuxtApp.vueApp.config.globalProperties.$toast
    return getToast()
}