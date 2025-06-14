<!--suppress TypeScriptCheckImport -->
<script lang="ts" setup>
import {Form, type FormSubmitEvent} from "@primevue/forms";
import {zodResolver} from '@primevue/forms/resolvers/zod'
import {z} from "zod";
import {useAuthStore} from "~/stores/auth";

definePageMeta({
	layout: 'auth'
})

const auth = useAuthStore()
const toastService = usePVToastService()

const resolver = ref(zodResolver(
	z.object({
		usernameOrEmail: z.string().min(1, 'Username or Email is required.'),
		password: z.string().min(1, 'Password is required.')
	})
))

const login = async ({valid, values, errors}: FormSubmitEvent) => {
	if (valid) {
		await auth.login(values)
	} else {
		console.log(errors)
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
	<Card class="w-full md:w-[500px]">
		<template #title>
			<div class="w-full text-left text-xl">Login</div>
		</template>
		<template #subtitle>
			<div class="w-full text-left mb-2">Type in your credentials below to login.</div>
		</template>
		<template #content>
			<Form :resolver class="flex flex-col gap-3 w-full" @submit="login">
				<div class="w-full space-y-3">
					<FormField v-slot="$field" class="space-y-1" initialValue="" name="usernameOrEmail">
						<FloatLabel variant="on">
							<label for="usernameOrEmail">Username or Email</label>
							<InputText id="usernameOrEmail" class="w-full" type="text"/>
						</FloatLabel>
						<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
							{{ $field.error.message }}
						</Message>
					</FormField>
					<FormField v-slot="$field" class="space-y-1" initialValue="" name="password">
						<FloatLabel variant="on">
							<label for="password">Password</label>
							<InputText id="password" class="w-full" type="password"/>
						</FloatLabel>
						<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
							{{ $field.error.message }}
						</Message>
					</FormField>
				</div>
				<div class="flex justify-between">
					<NuxtLink class="hover:underline hover:underline-offset-4 text-blue-500 text-sm"
							  to="/auth/request-account">Request Account
					</NuxtLink>
					<NuxtLink class="hover:underline hover:underline-offset-4 text-blue-500 text-sm"
							  to="/auth/forgot-password">Forgot Password?
					</NuxtLink>
				</div>
				<Button :disabled="auth.pending" :loading="auth.pending" class="w-full" label="Login" type="submit"/>
			</Form>
		</template>
	</Card>

</template>