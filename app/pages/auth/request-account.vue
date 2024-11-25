<!--suppress TypeScriptCheckImport -->
<script setup lang="ts">
import {zodResolver} from "@primevue/forms/resolvers/zod";
import {z} from "zod";
import type {FormSubmitEvent} from "@primevue/forms";

definePageMeta({
  layout: 'auth'
})

const toastService = usePVToastService()
const config = useRuntimeConfig()
const pending = ref(false)

const {data: counties} = await useFetch(`${config.public.apiUrl}/counties`, {
  method: 'GET',
  headers: {
    'api-key': config.public.apiKey.toString(),
  },
})

const resolver = ref(zodResolver(
    z.object({
      firstName: z.string().min(1, 'First name is required.').trim(),
      middleName: z.string().min(1, 'Middle name is required.').trim(),
      lastName: z.string().min(1, 'Last name is required.').trim(),
      email: z.string().min(1, 'Your email is required.').email('Valid email is required.').trim(),
      position: z.string().min(1, 'Your position is required.').trim(),
      countyId: z.string({message: 'County is required'}).min(1, 'County is required.').trim(),
      organization: z.string().min(1, 'Your organization is required.').trim(),
      department: z.string().min(1, 'Your department is required.').trim(),
      reason: z.string().min(50, 'Minimum of 25 characters').trim(),
    })
))

const requestAccount = async ({values, valid, errors}: FormSubmitEvent) => {
  if (valid) {
    pending.value = true
    console.log(values)
    await $fetch(`${config.public.apiUrl}/account-request`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'api-key': config.public.apiKey.toString(),
        'content-type': 'application/json'
      },
      ignoreResponseErrors: true
    })
        .then((res) => {
          return res
        })
        .then(async (res) => {
              toastService.add({
                severity: 'success',
                summary: res.status,
                detail: res.message,
                life: 10000
              })
              await navigateTo('/auth/login')
            })
        .catch((err) => {
          toastService.add({
            severity: 'error',
            summary: err.data?.status || 'Error',
            detail: err.data?.message || 'Something went wrong. If this continues, please get in touch with the ICT Unit.',
            life: 10000
          })
        })
        .finally(() => {
          pending.value = false
        })
  } else {
    for (const e in errors) {
      toastService.add({
        severity: 'error',
        summary: 'Error',
        detail: errors[e][0].message,
        life: 5000,
      })
    }
  }
}
</script>

<template>
    <Card class="md:w-[600px]">
      <template #title><div class="w-full text-left text-xl">Request Account</div></template>
      <template #subtitle><div class="w-full text-left mb-2">Please fill out and submit the form below to request an account to access this application.</div></template>
      <template #content>
        <Form :resolver class="flex flex-col gap-3 w-full" @submit="requestAccount">
          <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-2">
            <FormField v-slot="$field" name="firstName" initialValue="" class="space-y-1">
              <FloatLabel variant="on">
                <InputText id="firstName" class="w-full" type="text"/>
                <label for="firstName">First Name</label>
              </FloatLabel>
              <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
            </FormField>
            <FormField v-slot="$field" name="middleName" initialValue="" class="space-y-1">
              <FloatLabel variant="on">
                <InputText id="middleName" class="w-full" type="text"/>
                <label for="middleName">Middle Name</label>
              </FloatLabel>
              <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
            </FormField>
            <FormField v-slot="$field" name="lastName" initialValue="" class="space-y-1">
              <FloatLabel variant="on">
                <InputText id="lastName" class="w-full" type="text"/>
                <label for="lastName">Last Name</label>
              </FloatLabel>
              <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
            </FormField>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-2 md:col-span-3">
              <FormField v-slot="$field" name="email" initialValue="" class="space-y-1">
                <FloatLabel variant="on" class="md:col-span-1">
                  <InputText id="email" class="w-full" type="text"/>
                  <label for="email">Email</label>
                </FloatLabel>
                <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
              </FormField>
              <FormField v-slot="$field" name="countyId" initialValue="" class="space-y-1">
                <FloatLabel variant="on" class="md:col-span-1">
                  <Select id="countyId" :options="counties?.data?.sort((a, b) => a.name.localeCompare(b.name))" optionLabel="name" optionValue="id" fluid showClear />
                  <label for="countyId">County of Assignment</label>
                </FloatLabel>
                <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
              </FormField>
            </div>
            <FormField v-slot="$field" name="organization" initialValue="" class="space-y-1">
              <FloatLabel class="w-full" variant="on">
                <InputText id="organization" class="w-full" type="text"/>
                <label for="organization">Organization</label>
              </FloatLabel>
              <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
            </FormField>
            <FormField v-slot="$field" name="department" initialValue="" class="space-y-1">
              <FloatLabel class="w-full" variant="on">
                <InputText id="department" class="w-full" type="text"/>
                <label for="department">Department</label>
              </FloatLabel>
              <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
            </FormField>
            <FormField v-slot="$field" name="position" initialValue="" class="space-y-1">
              <FloatLabel variant="on">
                <InputText id="position" class="w-full" type="text"/>
                <label for="position">Position</label>
              </FloatLabel>
              <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
            </FormField>
            <FormField v-slot="$field" name="reason" initialValue="" class="space-y-1 md:col-span-3">
              <FloatLabel variant="on">
                <Textarea id="reason" rows="5" cols="30" class="resize-none w-full" />
                <label for="reason">Reason you need access.</label>
              </FloatLabel>
              <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
            </FormField>
          </div>
          <div class="flex justify-between items-center">
            <NuxtLink to="/auth/login" class="hover:underline hover:underline-offset-4 text-blue-500 text-sm">Login</NuxtLink>
            <NuxtLink to="/auth/forgot-password" class="hover:underline hover:underline-offset-4 text-blue-500 text-sm">Forgot Password?</NuxtLink>
          </div>
          <Button label="Request Account" class="w-full" type="submit" :disabled="pending" :loading="pending" />
        </Form>
      </template>
    </Card>
</template>