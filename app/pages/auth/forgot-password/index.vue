<script lang="ts" setup>
import {zodResolver} from "@primevue/forms/resolvers/zod"
import {z} from 'zod'
import type {FormSubmitEvent} from "@primevue/forms";

definePageMeta({
	layout: 'auth'
})

const config = useRuntimeConfig()
const toastService = usePVToastService()
const pending = ref(false)

const resolver = ref(zodResolver(
	z.object({
		usernameOrEmail: z.string().min(1, 'Your username or email is required.'),
	})
))

const onSubmit = async ({valid, values, errors}: FormSubmitEvent) => {
	pending.value = true
	if (valid) {
		await $fetch(`${config.public.apiUrl}/auth/forgot-password`, {
			method: 'POST',
			headers: {
				'api-key': config.public.apiKey,
				'content-type': 'application/json'
			},
			body: JSON.stringify(values),
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
			.finally(() => {
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
		<template #title>
			<div class="w-full text-left text-xl">Forgot Password</div>
		</template>
		<template #subtitle>
			<div class="w-full text-left mb-2">Type in your username or email to reset your password.</div>
		</template>
		<template #content>
			<Form :resolver class="flex flex-col gap-3 w-full" @submit="onSubmit">
				<FormField v-slot="$field" class="w-full space-y-2" initialValue="" name="usernameOrEmail">
					<FloatLabel variant="on">
						<InputText id="usernameOrEmail" class="w-full" type="text"/>
						<label for="usernameOrEmail">Username or Email</label>
					</FloatLabel>
					<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
						{{ $field.error.message }}
					</Message>
				</FormField>
				<div class="flex justify-between">
					<NuxtLink class="hover:underline hover:underline-offset-4 text-blue-500 text-sm" to="/auth/login">
						Login
					</NuxtLink>
					<NuxtLink class="hover:underline hover:underline-offset-4 text-blue-500 text-sm"
							  to="/auth/request-account">Request Account
					</NuxtLink>
				</div>
				<Button :disabled="pending" :loading="pending" class="w-full" label="Submit" type="submit"/>
			</Form>
		</template>
	</Card>
</template>