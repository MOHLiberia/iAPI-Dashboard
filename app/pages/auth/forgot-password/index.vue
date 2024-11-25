<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

import {type ToastServiceMethods, useToast} from "primevue";
import {capitalize} from "vue";

const toast:ToastServiceMethods = useToast()

const showToast = (severity: "error" | "success" | "info" | "warn" | "secondary" | "contrast", message: string, life: number = 3000)=> {
  toast.add({severity, summary: capitalize(severity), detail: message, life})
}

const login = async () => {
  showToast('success', 'Login Successful')
  await navigateTo('/')
}
</script>

<template>
    <Card class="md:w-[500px]">
      <template #title><div class="w-full text-left text-xl">Forgot Password</div></template>
      <template #subtitle><div class="w-full text-left mb-2">Type in your username or email to reset your password.</div></template>
      <template #content>
        <div class="flex flex-col gap-4 w-full">
          <div class="w-full space-y-2">
            <FloatLabel variant="on">
              <InputText id="usernameOrEmail" class="w-full" type="text"/>
              <label for="usernameOrEmail">Username or Email</label>
            </FloatLabel>
          </div>
          <div class="flex justify-between">
            <NuxtLink to="/auth/login" class="hover:underline hover:underline-offset-4 text-blue-500 text-sm">Login</NuxtLink>
            <NuxtLink to="/auth/request-account" class="hover:underline hover:underline-offset-4 text-blue-500 text-sm">Request Account</NuxtLink>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="mt-2">
          <Button label="Reset Password" class="w-full" @click="login" />
        </div>
      </template>
    </Card>
</template>