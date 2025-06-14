<!--suppress TypeScriptCheckImport -->
<script lang="ts" setup>
import {zodResolver} from "@primevue/forms/resolvers/zod";
import {z} from "zod";
import type {FormSubmitEvent} from "@primevue/forms";

definePageMeta({
	layout: 'auth'
})

const toastService = usePVToastService()
const config = useRuntimeConfig()
const loading = ref(false)

const {data: counties, pending} = useFetch(`${config.public.apiUrl}/counties`, {
	method: 'GET',
	headers: {
		'api-key': config.public.apiKey.toString(),
	},
})

const resolver = ref(zodResolver(
	z.object({
		firstName: z.string().min(1, 'First name is required.').trim(),
		middleName: z.string().min(1, 'Middle name is required.').trim().or(z.string().max(0).trim()),
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
	loading.value = true
	if (valid) {
		await $fetch(`${config.public.apiUrl}/account-request`, {
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				'api-key': config.public.apiKey.toString(),
				'content-type': 'application/json'
			},
			ignoreResponseErrors: true
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
				loading.value = false
			})
	} else {
		loading.value = false
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
		<template #title>
			<div class="w-full text-left text-xl">Request Account</div>
		</template>
		<template #subtitle>
			<div class="w-full text-left mb-2">Please fill out and submit the form below to request an account to access
				this application.
			</div>
		</template>
		<template #content>
			<Form :resolver class="flex flex-col gap-3 w-full" @submit="requestAccount">
				<div class="w-full grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-2">
					<FormField v-slot="$field" class="space-y-1" initialValue="" name="firstName">
						<FloatLabel variant="on">
							<InputText id="firstName" class="w-full" type="text"/>
							<label for="firstName">First Name</label>
						</FloatLabel>
						<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
							{{ $field.error.message }}
						</Message>
					</FormField>
					<FormField v-slot="$field" class="space-y-1" initialValue="" name="middleName">
						<FloatLabel variant="on">
							<InputText id="middleName" class="w-full" type="text"/>
							<label for="middleName">Middle Name</label>
						</FloatLabel>
						<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
							{{ $field.error.message }}
						</Message>
					</FormField>
					<FormField v-slot="$field" class="space-y-1" initialValue="" name="lastName">
						<FloatLabel variant="on">
							<InputText id="lastName" class="w-full" type="text"/>
							<label for="lastName">Last Name</label>
						</FloatLabel>
						<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
							{{ $field.error.message }}
						</Message>
					</FormField>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3 md:col-span-3">
						<FormField v-slot="$field" class="space-y-1" initialValue="" name="email">
							<FloatLabel class="md:col-span-1" variant="on">
								<InputText id="email" class="w-full" type="text"/>
								<label for="email">Email</label>
							</FloatLabel>
							<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
								{{ $field.error.message }}
							</Message>
						</FormField>
						<FormField v-slot="$field" class="space-y-1" initialValue="" name="countyId">
							<FloatLabel class="md:col-span-1" variant="on">
								<Select id="countyId"
										:loading="pending" :options="counties?.data?.sort((a, b) => a.name.localeCompare(b.name))"
										filter fluid optionLabel="name" optionValue="id" showClear/>
								<label for="countyId">County of Assignment</label>
							</FloatLabel>
							<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
								{{ $field.error.message }}
							</Message>
						</FormField>
					</div>
					<FormField v-slot="$field" class="space-y-1" initialValue="" name="organization">
						<FloatLabel class="w-full" variant="on">
							<InputText id="organization" class="w-full" type="text"/>
							<label for="organization">Organization</label>
						</FloatLabel>
						<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
							{{ $field.error.message }}
						</Message>
					</FormField>
					<FormField v-slot="$field" class="space-y-1" initialValue="" name="department">
						<FloatLabel class="w-full" variant="on">
							<InputText id="department" class="w-full" type="text"/>
							<label for="department">Department</label>
						</FloatLabel>
						<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
							{{ $field.error.message }}
						</Message>
					</FormField>
					<FormField v-slot="$field" class="space-y-1" initialValue="" name="position">
						<FloatLabel variant="on">
							<InputText id="position" class="w-full" type="text"/>
							<label for="position">Position</label>
						</FloatLabel>
						<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
							{{ $field.error.message }}
						</Message>
					</FormField>
					<FormField v-slot="$field" class="space-y-1 md:col-span-3" initialValue="" name="reason">
						<FloatLabel variant="on">
							<Textarea id="reason" class="resize-none w-full" cols="30" rows="5"/>
							<label for="reason">Reason you need access.</label>
						</FloatLabel>
						<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
							{{ $field.error.message }}
						</Message>
					</FormField>
				</div>
				<div class="flex justify-between items-center">
					<NuxtLink class="hover:underline hover:underline-offset-4 text-blue-500 text-sm" to="/auth/login">
						Login
					</NuxtLink>
					<NuxtLink class="hover:underline hover:underline-offset-4 text-blue-500 text-sm"
							  to="/auth/forgot-password">Forgot Password?
					</NuxtLink>
				</div>
				<Button :disabled="loading" :loading="loading" class="w-full" label="Request Account" type="submit"/>
			</Form>
		</template>
	</Card>
</template>