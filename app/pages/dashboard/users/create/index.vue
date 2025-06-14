<script lang="ts" setup>
import {Form, type FormSubmitEvent} from "@primevue/forms";
import {zodResolver} from '@primevue/forms/resolvers/zod'
import {z} from "zod";

definePageMeta({
	label: "New User",
	icon: "tabler:user-plus"
})

const confirm = useConfirm()
const config = useRuntimeConfig()

const {data: counties, pending: pendingCounties} = useFetch(`${config.public.apiUrl}/counties`, {
	method: 'GET',
	headers: {
		'api-key': config.public.apiKey.toString(),
	},
})

const {data: organizations, pending: pendingOrganizations} = useFetch(`${config.public.apiUrl}/organizations`, {
	method: 'GET',
	headers: {
		'api-key': config.public.apiKey.toString(),
	},
})

const selectedOrganization = ref<string | null>(null)

const filteredDepartments = computed(() => {
	if (!selectedOrganization.value) return []
	const org = organizations.value?.data?.find(org => org.id === selectedOrganization.value)
	return org ? org.departments : []
})

watch(selectedOrganization, (newVal) => {
	console.log("Selected Organization ID:", newVal)
})

const resolver = ref(zodResolver(
	z.object({
		username: z.string({message: 'Username is Required'}).min(5, 'Username is too short.').trim(),
		passwordGroup: z.object({
			password: z.string().min(8, 'Password is too short').trim()
				.refine((value) => /[a-z]/g.test(value), {message: 'Password must have a lowercase letter.'})
				.refine((value) => /[A-Z]/g.test(value), {message: 'Password must have an uppercase letter.'})
				.refine((value) => /d/g.test(value), {message: 'Password must have a number.'})
				.refine((value) => /[^\w\s:]/g.test(value), {message: 'Password must have a special character.'}),
			confirmPassword: z.string().min(1, 'Please confirm your password.')
		}).refine((schema) => schema.password === schema.confirmPassword, {message: 'Passwords do not match.'}),
		email: z.string().email('Please enter a valid email').min(8).trim(),
		profile: z.object({
			firstName: z.string().trim(),
			middleName: z.string().trim().optional(),
			lastName: z.string().trim(),
			county: z.string().trim().optional(),
			organizationId: z.string().optional(),
			departmentId: z.string().optional(),
		}).optional()
	})
))

const cancel = () => {
	confirm.require({
		header: "Cancel",
		message: "Are you sure you want to cancel?",
		acceptProps: {
			label: 'Yes',
			severity: 'danger',
		},
		rejectProps: {
			label: "No",
			severity: "success",
		},
		accept: async () => {
			await navigateTo("/dashboard/users")
		},
	})
}
</script>

<template>
	<div class="flex justify-center">
		<Card class="w-full md:w-fit">
			<template #title>
				Create New User
			</template>
			<template #content>
				<Form :resolver>
					<div class="w-full flex flex-col gap-2">
						<Divider align="left" type="solid">
							<b>Account Details</b>
						</Divider>
						<div class="grid md:grid-cols-2 gap-3">
							<FormField v-slot="$field" class="space-y-1" initialValue="" name="username">
								<FloatLabel variant="on">
									<label for="username">Username</label>
									<InputText id="username" class="w-full" type="text"/>
								</FloatLabel>
								<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
									{{ $field.error.message }}
								</Message>
							</FormField>
							<FormField v-slot="$field" class="space-y-1" initialValue="" name="email">
								<FloatLabel variant="on">
									<label for="email">Email</label>
									<InputText id="email" class="w-full" type="text"/>
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
							<FormField v-slot="$field" class="space-y-1" initialValue="" name="password">
								<FloatLabel variant="on">
									<label for="password">Confirm Password</label>
									<InputText id="password" class="w-full" type="password"/>
								</FloatLabel>
								<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
									{{ $field.error.message }}
								</Message>
							</FormField>
						</div>
						<Divider align="left" class="col-span-4" type="solid">
							<b>Profile Details</b>
						</Divider>
						<div class="space-y-3">
							<div class="grid md:grid-cols-3 gap-3">
								<FormField v-slot="$field" class="space-y-1" initialValue="" name="firstName">
									<FloatLabel variant="on">
										<label for="firstName">First Name</label>
										<InputText id="firstName" class="w-full" type="text"/>
									</FloatLabel>
									<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
										{{ $field.error.message }}
									</Message>
								</FormField>
								<FormField v-slot="$field" class="space-y-1" initialValue="" name="middleName">
									<FloatLabel variant="on">
										<label for="middle">Middle Name</label>
										<InputText id="middleName" class="w-full" type="text"/>
									</FloatLabel>
									<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
										{{ $field.error.message }}
									</Message>
								</FormField>
								<FormField v-slot="$field" class="space-y-1" initialValue="" name="lastName">
									<FloatLabel variant="on">
										<label for="lastName">Last Name</label>
										<InputText id="lastName" class="w-full" type="text"/>
									</FloatLabel>
									<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
										{{ $field.error.message }}
									</Message>
								</FormField>
							</div>
							<div class="grid md:grid-cols-2 gap-3">
								<FormField v-slot="$field" class="space-y-1" initialValue="" name="countyId">
									<FloatLabel class="md:col-span-1" variant="on">
										<Select id="countyId"
												:loading="pendingCounties"
												:options="counties?.data?.sort((a, b) => a.name.localeCompare(b.name))" filter fluid optionLabel="name"
												optionValue="id" showClear/>
										<label for="countyId">County of Assignment</label>
									</FloatLabel>
									<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
										{{ $field.error.message }}
									</Message>
								</FormField>
								<FormField v-slot="$field" class="space-y-1" initialValue="" name="organizationId">
									<FloatLabel class="md:col-span-1" variant="on">
										<Select id="organizationId" v-model="selectedOrganization"
												:loading="pendingOrganizations"
												:options="organizations?.data?.sort((a, b) => a.name.localeCompare(b.name))" filter fluid
												optionLabel="name" optionValue="id" showClear/>
										<label for="organizationId">Organization</label>
									</FloatLabel>
									<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
										{{ $field.error.message }}
									</Message>
								</FormField>
								<FormField v-slot="$field" class="space-y-1" initialValue="" name="departmentId">
									<FloatLabel class="md:col-span-1" variant="on">
										<Select id="departmentId" :options="filteredDepartments" filter
												fluid optionLabel="name" optionValue="id" showClear/>
										<label for="departmentId">Department</label>
									</FloatLabel>
									<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
										{{ $field.error.message }}
									</Message>
								</FormField>
								<!--              <FormField v-slot="$field" name="department" initialValue="" class="space-y-1">-->
								<!--                <FloatLabel class="w-full" variant="on">-->
								<!--                  <InputText id="department" class="w-full" type="text"/>-->
								<!--                  <label for="department">Department</label>-->
								<!--                </FloatLabel>-->
								<!--                <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>-->
								<!--              </FormField>-->
								<FormField v-slot="$field" class="space-y-1" initialValue="" name="position">
									<FloatLabel variant="on">
										<InputText id="position" class="w-full" type="text"/>
										<label for="position">Position</label>
									</FloatLabel>
									<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
										{{ $field.error.message }}
									</Message>
								</FormField>
							</div>
						</div>
					</div>
				</Form>
			</template>
			<template #footer>
				<div class="flex gap-2">
					<Button class="w-full" label="Cancel" severity="danger" @click="cancel"/>
					<Button class="w-full" label="Submit" severity="success"/>
				</div>
			</template>
		</Card>
	</div>
</template>
