<script lang="ts" setup>
import {Form, type FormSubmitEvent} from "@primevue/forms";
import {zodResolver} from '@primevue/forms/resolvers/zod'
import {z} from "zod";

definePageMeta({
	label: "Add DHIS2 Instance",
	icon: "tabler:plus"
})

const toastService = usePVToastService()
const config = useRuntimeConfig()
const router = useRouter()

const loading = ref(false)

const DHIS2versions = [
	{id: '2.36', name: '2.36'},
	{id: '2.37', name: '2.37'},
	{id: '2.38', name: '2.38'},
	{id: '2.39', name: '2.39'},
	{id: '2.40', name: '2.40'},
	{id: '2.41', name: '2.41'},
]

const resolver = ref(zodResolver(
	z.object({
		name: z.string().min(1, 'Name is required.'),
		type: z.string().min(1, 'Application Type is required.'),
		description: z.string().optional(),
		baseURL: z.string().url('Base URL must be a valid URL.'),
		apiURL: z.string().url('API URL must be a valid URL.'),
		active: z.boolean().default(true),
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
				Add DHIS2 Instance
			</template>
			<template #content>
				<Form v-slot="$form" :resolver @submit="submit">
					<div class="grid md:grid-cols-2 gap-3 mb-4">
						<div class="grid md:grid-cols-3 md:col-span-2 gap-3">
							<FormField v-slot="$field" class="space-y-1 md:col-span-2" initialValue="" name="name">
								<FloatLabel variant="on">
									<label for="fullName">Full Name</label>
									<InputText id="name" class="w-full" type="text"/>
								</FloatLabel>
								<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
									{{ $field.error.message }}
								</Message>
							</FormField>
							<FormField v-slot="$field" class="space-y-1 md:col-span-1" initialValue="" name="shortName">
								<FloatLabel variant="on">
									<label for="shortName">Short Name</label>
									<InputText id="shortName" class="w-full" type="text"/>
								</FloatLabel>
								<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
									{{ $field.error.message }}
								</Message>
							</FormField>
						</div>
						<div class="grid md:grid-cols-3 md:col-span-2 gap-3">
							<FormField v-slot="$field" class="space-y-1 md:col-span-2" initialValue=""
									   name="description">
								<FloatLabel variant="on">
									<label for="description">Description</label>
									<InputText id="description" class="w-full" type="text"/>
								</FloatLabel>
								<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
									{{ $field.error.message }}
								</Message>
							</FormField>
							<FormField v-slot="$field" class="space-y-1" initialValue="" name="">
								<FloatLabel class="md:col-span-1" variant="on">
									<Select id="type" :options="DHIS2versions" fluid optionLabel="name" optionValue="id"
											showClear/>
									<label for="type">Version</label>
								</FloatLabel>
								<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
									{{ $field.error.message }}
								</Message>
							</FormField>
						</div>
						<FormField v-slot="$field" class="space-y-1" initialValue="" name="baseURL">
							<FloatLabel variant="on">
								<label for="baseURL">Base URL</label>
								<InputText id="baseURL" class="w-full" type="text"/>
							</FloatLabel>
							<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
								{{ $field.error.message }}
							</Message>
						</FormField>
						<FormField v-slot="$field" class="space-y-1" initialValue="" name="apiURL">
							<FloatLabel variant="on">
								<label for="baseURL">API URL</label>
								<InputText id="baseURL" class="w-full" type="text"/>
							</FloatLabel>
							<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
								{{ $field.error.message }}
							</Message>
						</FormField>
						<div class="flex  gap-2">
							<ToggleSwitch name="Active"/>
							<label for="active">Is Instance Currently Active?</label>
							<Message v-if="$form.active?.invalid" severity="error" size="small" variant="simple">
								{{ $form.active.error?.message }}
							</Message>
						</div>
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