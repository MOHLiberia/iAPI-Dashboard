<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

import {type ToastServiceMethods, useToast} from "primevue";
import {capitalize} from "vue";

const pin = ref('')
const toast:ToastServiceMethods = useToast()
const showToast = (severity: "error" | "success" | "info" | "warn" | "secondary" | "contrast", message: string, life: number = 3000)=> {
  toast.add({severity, summary: capitalize(severity), detail: pin, life})
}

const resetPassword = async () => {
  showToast('success', pin.value)
}
</script>

<template>
  <Card class="md:w-[500px]">
    <template #title><div class="w-full text-left text-xl">Password Reset Pin</div></template>
    <template #subtitle><div class="w-full text-left mb-2">Please enter the 6-digit pin sent to your email. If an email is not received please hit the resend pin button below.</div></template>
    <template #content>
      <div class="flex flex-col gap-4">
        <InputOtp name="pin" class="self-center" v-model="pin" :length="6"/>
        <div class="flex justify-between">
          <NuxtLink to="/auth/request-account" class="hover:underline hover:underline-offset-4 text-blue-500 text-sm">Resend Code</NuxtLink>
          <NuxtLink to="/auth/login" class="hover:underline hover:underline-offset-4 text-blue-500 text-sm">Login</NuxtLink>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="mt-2">
        <Button label="Reset Password" class="w-full" @click="resetPassword" />
      </div>
    </template>
  </Card>
</template>