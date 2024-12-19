<script setup lang="ts">
import {Form, type FormSubmitEvent} from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { z } from "zod"

definePageMeta({
  layout: "auth",
  title: 'Reset Password',
  name: 'reset-password',
})

const config = useRuntimeConfig()
const toastService = usePVToastService()
const id = useRoute().query['id']

const pending =ref(false)

const resolver = ref(zodResolver(
    z.object({
      password: z.string().min(8, { message: 'Passwords must be at least 8 characters' })
          .refine((password) => /[A-Z]/.test(password), { message: 'Password must include uppercase letters.'})
          .refine((password) => /[a-z]/.test(password), { message: 'Password must include lowercase letters.'})
          .refine((password) => /[0-9]/.test(password), { message: 'Password must include numbers.' })
          .refine((password) => /[!@#$%^&*]/.test(password), { message: 'Password must include special characters.'}),
      confirmPassword: z.string().min(1, 'Please confirm your password.')
    }).refine((schema) => schema.password === schema.confirmPassword, {
      message: 'Passwords do not match.',
      path: ["verifyPassword"] })
))

const resetPassword = async ({ values, valid, errors }:FormSubmitEvent) => {
  pending.value = true
  if (valid) {
  await $fetch(`${config.public.apiUrl}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'api-key': config.public.apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({...values, id}),
  }).then(async (res) => {
    toastService.add({
      severity: 'success',
      summary: res.status,
      detail: res.message,
      life: 5000
    })
    await navigateTo('/auth/login')
  }).catch((error) => {
    if (error.data?.error) {
      for (const e in error.data?.error) {
        toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.data?.error[e]['message'],
          life: 5000,
        })
      }
      return
    }
    toastService.add({
      severity: 'error',
      summary: error.data?.status || 'Error',
      detail: error.data?.message || 'Something went wrong. If this continues, please get in touch with the ICT Unit.',
      life: 5000
    })
  }).finally(async ()=> {
    pending.value = false
  })
  } else {
    for (const e in errors) {
      toastService.add({
        severity: 'error',
        summary: 'Error',
        detail: errors[e][0].message,
        life: 3000,
      })
    }
    pending.value = false
  }
}
</script>

<template>
  <Card class="w-full md:w-[500px]">
    <template #title><div class="w-full text-left text-xl">Reset Password</div></template>
    <template #subtitle><div class="w-full text-left mb-2">Type in and verify your new password below to change it.</div></template>
    <template #content>
      <Form :resolver @submit="resetPassword" class="flex flex-col gap-3 w-full">
        <div class="w-full space-y-3">
          <FormField v-slot="$field" name="password" initialValue="" class="space-y-1">
            <FloatLabel variant="on">
              <label for="password">Password</label>
              <InputText id="password" class="w-full" type="password" />
            </FloatLabel>
            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
          </FormField>
          <FormField v-slot="$field" name="confirmPassword" initialValue="" validate-on-blur :validateOnValueUpdate="false" class="space-y-1">
            <FloatLabel variant="on">
              <label for="confirmPassword">Confirm Password</label>
              <InputText id="confirmPassword" class="w-full" type="password"  />
            </FloatLabel>
            <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
          </FormField>
        </div>
        <div class="flex justify-between">
          <NuxtLink to="/auth/request-account" class="hover:underline hover:underline-offset-4 text-blue-500 text-sm">Request Account</NuxtLink>
          <NuxtLink to="/auth/forgot-password" class="hover:underline hover:underline-offset-4 text-blue-500 text-sm">Forgot Password?</NuxtLink>
        </div>
        <Button label="Submit" class="w-full" type="submit" :disabled="pending" :loading="pending" />
      </Form>
    </template>
  </Card>
</template>