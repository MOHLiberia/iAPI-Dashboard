<script setup lang="ts">
import {zodResolver} from "@primevue/forms/resolvers/zod";
import {z} from 'zod'
import type {FormSubmitEvent} from "@primevue/forms";

definePageMeta({
  layout: 'auth'
})

const toastService = usePVToastService()
const config = useRuntimeConfig()
const route = useRoute()

const pin = ref('')
const id = useRoute().query['id']
const pending = ref(false)

const resolver = ref(zodResolver(
    z.object({
      resetPin: z.string().min(1, 'Reset pin is required.'),
    })
))

const resendPin = async () => {
  console.log(id)
  await $fetch(`${config.public.apiUrl}/auth/resend-reset-pin`, {
    method: 'POST',
    headers: {
      'api-key': config.public.apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ id })
  })
      .then(async (res) => {
        toastService.add({
          severity: 'success',
          summary: res.status,
          detail: res.message,
          life: 10000
        })
      }).catch((err) => {
        toastService.add({
          severity: 'error',
          summary: err.data?.status || 'Error',
          detail: err.data?.message || 'Something went wrong. If this continues, please get in touch with the ICT Unit.',
          life: 10000
        })
      })
      .finally(()=> {
        pending.value = false
      })
}

const onSubmit = async ({values, valid, errors}: FormSubmitEvent) => {
  pending.value = true
  if (valid) {
    await $fetch(`${config.public.apiUrl}/auth/verify-reset-pin`, {
      method: 'POST',
      headers: {
        'api-key': config.public.apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({resetPin: pin.value, id}),
    }).then(async (res) => {
      toastService.add({
        severity: 'success',
        summary: res.status,
        detail: res.message,
        life: 5000
      })
      await navigateTo({
        name: 'reset-password',
        query: {
          id,
        },
        replace: true,
      })
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
    pending.value = false
    for (const e in errors) {
      toastService.add({
        severity: 'error',
        summary: 'Error',
        detail: errors[e][0].message,
        life: 3000,
      })
    }
  }
}

</script>

<template>
  <Card class="md:w-[500px]">
    <template #title><div class="w-full text-left text-xl">Password Reset Pin</div></template>
    <template #subtitle><div class="w-full text-left mb-2">Please enter the 6-digit pin sent to your email. If an email is not received please hit the resend pin button below.</div></template>
    <template #content>
      <Form class="flex flex-col items-center gap-4" :resolver @submit="onSubmit">
        <FormField v-slot="$field" name="resetPin" initialValue="" class="space-y-2">
          <InputOtp id="resetPin" class="self-center" v-model="pin" :length="6" size="large" integerOnly />
          <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
        </FormField>
        <div class="flex justify-between w-full">
          <div @click="resendPin" class="hover:underline hover:underline-offset-4 text-blue-500 text-sm hover:cursor-pointer select-none">Resend Pin</div>
          <NuxtLink to="/auth/login" class="hover:underline hover:underline-offset-4 text-blue-500 text-sm">Login</NuxtLink>
        </div>
        <Button label="Verify" class="w-full" type="submit" :disabled="pending" :loading="pending" />
      </Form>
    </template>
  </Card>
</template>