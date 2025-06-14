<script lang="ts" setup>
import {Form, type FormSubmitEvent} from "@primevue/forms";
import {zodResolver} from '@primevue/forms/resolvers/zod'
import {z} from "zod";

definePageMeta({
	label: "New Application",
	icon: "tabler:plus"
})

const toastService = usePVToastService()
const config = useRuntimeConfig()
const router = useRouter()

const loading = ref(false)

const applicationTypes = [
	{id: 'Web', name: 'Web Application'},
	{id: 'Desktop', name: 'Desktop Application'},
	{id: 'Mobile', name: 'Mobile Application'},
	{id: 'Hybrid', name: 'Hybrid Application'},
]

const resolver = ref(zodResolver(
	z.object({
		name: z.string().min(1, 'Name is required.'),
		type: z.string().min(1, 'Application Type is required.'),
		description: z.string().optional(),
		baseURL: z.string().url('Base URL must be a valid URL.').optional().or(z.literal('')),
	})
))

const submit = async ({valid, values, errors}: FormSubmitEvent) => {
	loading.value = true
	if (valid) {
		await $fetch(`${config.public.apiUrl}/application/create`, {
			method: 'POST',
			headers: {
				'api-key': config.public.apiKey.toString(),
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				name: values.name,
				type: values.type,
				description: values.description,
				baseURL: values.baseURL,
			}),
		})
			.then(async (res) => {
				toastService.add({
					severity: 'success',
					summary: res.status,
					detail: res.message,
					life: 3000,
				})
				await navigateTo('/dashboard/applications')
			})
			.catch((err) => {
				toastService.add({
					severity: 'error',
					summary: err.data?.status || 'Error',
					detail: err.data?.message || 'Something went wrong. If this continues, please get in touch with the ICT Unit.',
					life: 5000,
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
				life: 3000,
			})
		}
	}
}

</script>

<template>
	<div class="flex justify-center w-full">
		<Card class="w-full md:w-[900px]">
			<template #title>
				Add New Application
			</template>
			<template #content>
				<Form :resolver @submit="submit">
					<div class="grid md:grid-cols-2 gap-3 mb-4">
						<FormField v-slot="$field" class="space-y-1" initialValue="" name="name">
							<FloatLabel variant="on">
								<label for="name">Name</label>
								<InputText id="name" class="w-full" type="text"/>
							</FloatLabel>
							<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
								{{ $field.error.message }}
							</Message>
						</FormField>
						<FormField v-slot="$field" class="space-y-1" initialValue="" name="type">
							<FloatLabel class="md:col-span-1" variant="on">
								<Select id="type" :options="applicationTypes" fluid optionLabel="name" optionValue="id"
										showClear/>
								<label for="type">Application Type</label>
							</FloatLabel>
							<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
								{{ $field.error.message }}
							</Message>
						</FormField>
						<FormField v-slot="$field" class="space-y-1" initialValue="" name="description">
							<FloatLabel variant="on">
								<label for="description">Description</label>
								<InputText id="description" class="w-full" type="text"/>
							</FloatLabel>
							<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
								{{ $field.error.message }}
							</Message>
						</FormField>
						<FormField v-slot="$field" class="space-y-1" initialValue="" name="baseURL">
							<FloatLabel variant="on">
								<label for="baseURL">URL</label>
								<InputText id="baseURL" class="w-full" type="text"/>
							</FloatLabel>
							<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
								{{ $field.error.message }}
							</Message>
						</FormField>
					</div>
					<div class="flex gap-2 mt-2">
						<Button :disabled="loading" class="w-full" label="Cancel" severity="danger"
								@click="$router.back()"/>
						<Button :disabled="loading" :loading class="w-full" label="Submit" severity="success"
								type="submit"/>
					</div>
				</Form>
			</template>
		</Card>
	</div>
</template>

<style scoped>

</style>