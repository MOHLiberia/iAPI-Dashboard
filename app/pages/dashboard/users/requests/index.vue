<script lang="ts" setup>
import {Form, type FormSubmitEvent} from "@primevue/forms";
import {zodResolver} from '@primevue/forms/resolvers/zod'
import {z} from "zod";

definePageMeta({
	label: "Account Requests",
	icon: "tabler:users-plus"
})

const confirm = useConfirm()
const config = useRuntimeConfig()

const {data: requests, pending} = useFetch(`${config.public.apiUrl}/account-request`, {
	method: 'GET',
	headers: {
		'api-key': config.public.apiKey.toString(),
		'content-type': 'application/json'
	},
})

const cancel = () => {
	confirm.require({
		header: "Cancel",
		message: "Are you sure you want to cancel?",
		acceptProps: {
			label: 'Yes',
			severity: 'danger',
		},
		rejectProps: {
			label: "Continue",
			severity: "success",
		},
		accept: async () => {
			await navigateTo("/dashboard/users")
		},
	})
}
</script>

<template>
	<div>
		<DataTable :loading="pending" :value="requests?.data" class="text-nowrap" showGridlines size="small">
			<Column field="firstName" header="First Name"/>
			<Column field="middleName" header="Middle Name"/>
			<Column field="lastName" header="Last Name"/>
			<Column field="email" header="Email"/>
			<Column field="organization" header="Organization"/>
			<Column class="!w-fit" field="department" header="Department"/>
			<Column class="!w-fit" field="county.name" header="County Name"/>
			<Column field="status" header="Status">
				<template #body="slotProps">
					<div class="flex justify-center">
						<div :class="slotProps.data.firstName === 'Chris' ? 'bg-green-500' : 'bg-orange-500'"
							 class="w-4 h-4 rounded-full animate-pulse"/>
					</div>
				</template>
			</Column>
			<Column body-style="{width: fit-content}" header="Actions" header-style="{max-width: fit-content}">
				<template #body="slotProps">
					<div class="flex justify-center">
						<NuxtLink :to="`/dashboard/users/requests/${slotProps.data.id}`">
							<Button label="View" size="small"/>
						</NuxtLink>
					</div>
				</template>
			</Column>
			<template #footer>There are <span class="font-semibold">{{ requests ? requests?.data.length : 0 }}</span>
				application request(s).
			</template>
		</DataTable>
	</div>
	{{ requests }}
</template>
