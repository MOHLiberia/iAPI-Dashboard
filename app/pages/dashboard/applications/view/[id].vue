<script lang="ts" setup>
import {FilterMatchMode} from '@primevue/core/api';

definePageMeta({
	label: 'Application',
	icon: 'tabler:app-window-filled'
})

const route = useRoute()
const config = useRuntimeConfig()
const isEditing = ref(false)
const router = useRouter()
const toastService = usePVToastService()

const edit = () => {
	isEditing.value = true
}

const cancelEdit = () => {
	isEditing.value = false
}

const showDeleteDialog = ref(false)

const loading = ref(false)

const types = ref([
	{id: 1, name: 'Web'},
	{id: 2, name: 'Desktop'},
	{id: 3, name: 'Mobile'},
	{id: 4, name: 'Hybrid'}
])

const {data: application, pending} = useFetch(`${config.public.apiUrl}/application/${route.params.id}`, {
	method: 'GET',
	headers: {
		'api-key': config.public.apiKey.toString(),
		'content-type': 'application/json'
	},
	query: {users: true, accountRequests: true, userSessions: true, files: true, roles: true, logs: true},
})

const filters = ref()

const initFilters = () => {
	filters.value = {
		global: {value: null, matchMode: FilterMatchMode.CONTAINS},
	}
}

initFilters()

const clearFilter = () => {
	initFilters()
}

const deleteApplication = async () => {
	await $fetch(`${config.public.apiUrl}/application/${route.params.id}`, {
		method: 'DELETE',
		headers: {
			'api-key': config.public.apiKey.toString(),
			'content-type': 'application/json'
		},
	}).then(() => {
		toastService.add({
			severity: 'success',
			summary: 'Success',
			detail: 'Application deleted successfully',
			life: 3000,
		})
	}).finally(async () => {
		router.back()
	})
}

const dialogHeader = computed(() => {
	if (pending.value || application.value?.data?.name) {
		return 'Delete Application'
	}
	return `Delete ${application.value.data.name}`
})

const getAccountSeverity = (accountEnabled: boolean) => {
	switch (accountEnabled) {
		case true:
			return 'success'
		case false:
			return 'danger'
		default:
			return 'warn'
	}
}

const getLogSeverity = (log: 'Info' | 'Warning' | 'Error') => {
	switch (log) {
		case 'Info':
			return 'info'
		case 'Warning':
			return 'warn'
		case 'Error':
			return 'danger'
	}
}

</script>

<template>
	<div class="flex flex-col gap-4">
		<Dialog v-model:visible="showDeleteDialog" :header="dialogHeader" modal>
			<p class="text-surface-500 dark:text-surface-400 mb-4 text-center">Are you sure you want to delete
				{{ application.data.name }}?</p>
			<p class="text-surface-500 dark:text-surface-400">This cannot be <span
				class="font-bold uppercase">undone</span> and <span class="font-bold uppercase">all data</span> will be
				permanently deleted!</p>
			<div class="flex justify-between gap-2 mt-4">
				<Button :disabled="loading" :loading label="Cancel" severity="success" type="button"
						@click="showDeleteDialog = false"/>
				<Button :disabled="loading" :loading label="Delete" severity="danger" type="button"
						@click="deleteApplication"/>
			</div>
		</Dialog>
		<Card class="">
			<template #title>
				<div class="flex">
					<div class="w-full">Details</div>
					<Button v-if="!isEditing" size="small" @click="edit">
						<Icon name="tabler:edit" size="1.25rem"/>
						<span>Edit</span>
					</Button>
					<div v-if="isEditing" class="flex gap-2">
						<Button severity="success" size="small" @click="edit">
							<Icon name="mingcute:save-2-line" size="1.25rem"/>
							<span>Save</span>
						</Button>
						<Button class="text-nowrap" severity="danger" size="small"
								@click="showDeleteDialog = !showDeleteDialog">
							<Icon name="tabler:trash" size="1.25rem"/>
							<span>Delete Application</span>
						</Button>
						<Button severity="danger" size="small" @click="cancelEdit">
							<Icon name="tabler:cancel" size="1.25rem"/>
							<span>Cancel</span>
						</Button>
					</div>
				</div>
			</template>
			<template #content>
				<Form>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
						<FormField v-slot="$field" :initialValue="application?.data?.name" class="space-y-1"
								   name="name">
							<label for="name">Name</label>
							<InputText id="name" :disabled="!isEditing" class="w-full" type="text"/>
							<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
								{{ $field.error.message }}
							</Message>
						</FormField>
						<FormField v-slot="$field" :initialValue="application?.data?.type" class="space-y-1"
								   name="typr">
							<label for="type">Type</label>
							<Select id="type" :disabled="!isEditing" :options="types" fluid optionLabel="name" optionValue="name"
									showClear/>
							<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
								{{ $field.error.message }}
							</Message>
						</FormField>
						<FormField v-slot="$field" :initialValue="application?.data?.description" class="space-y-1"
								   name="description">
							<label for="description">Description</label>
							<InputText id="description" :disabled="!isEditing" class="w-full" type="text"/>
							<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
								{{ $field.error.message }}
							</Message>
						</FormField>
						<FormField v-slot="$field" :initialValue="application?.data?.baseURL" class="space-y-1"
								   name="baseURL">
							<label for="description">URL</label>
							<InputText id="description" :disabled="!isEditing" class="w-full" type="text"/>
							<Message v-if="$field.invalid" severity="error" size="small" variant="simple">
								{{ $field.error.message }}
							</Message>
						</FormField>
					</div>
				</Form>
			</template>
		</Card>
		<Card class="">
			<template #title>
				Account Requests
			</template>
			<template #content>
				<DataTable v-model:filters="filters"
						   :global-filter-fields="['firstName', 'lastName', 'email', 'organization']"
						   :loading="pending" :rows="10" :value="application?.data?.AccountRequests"
						   class="text-nowrap"
						   currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator
						   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" showGridlines size="small">
					<template #header>
						<div class="flex justify-between">
							<Button label="Clear" size="small" type="button" @click="clearFilter()"/>
							<InputText v-model="filters['global'].value" placeholder="Keyword Search" size="small"/>
						</div>
					</template>
					<Column field="firstName" header="First Name"/>
					<Column field="lastName" header="Last Name"/>
					<Column field="email" header="Email"/>
					<Column field="organization" header="Organization"/>
					<Column field="status" header="Status">
						<template #body="slotProps">
							<div class="flex justify-center">
								<div :class="slotProps.data.firstName === 'Chris' ? 'bg-green-500' : 'bg-orange-500'"
									 class="w-4 h-4 rounded-full animate-pulse"/>
							</div>
						</template>
					</Column>
					<Column body-style="{width: fit-content}" header="Action(s)"
							header-style="{max-width: fit-content}">
						<template #body="slotProps">
							<div class="flex justify-center">
								<NuxtLink :to="`/dashboard/users/requests/${slotProps.data.id}`" class="w-full">
									<Button class="w-full" label="View" size="small"/>
								</NuxtLink>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
		<Card class="">
			<template #title>
				Users
			</template>
			<template #content>
				<DataTable :loading="pending" :rows="10" :value="application?.data?.users"
						   class="text-nowrap"
						   currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator
						   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" showGridlines size="small">
					<Column field="profile.firstName" header="First Name"/>
					<Column field="profile.lastName" header="Last Name"/>
					<Column field="email" header="Email"/>
					<Column field="profile.organization.name" header="Organization"/>
					<Column field="" header="Account Status">
						<template #body="slotProps">
							<Tag :severity="getAccountSeverity(slotProps.data.accountEnabled)"
								 :value="slotProps.data.accountEnabled ? 'Enabled' : 'Disabled'" class="w-full"/>
						</template>
					</Column>
					<Column body-style="{width: fit-content}" header="Action(s)"
							header-style="{max-width: fit-content}">
						<template #body="slotProps">
							<div class="flex justify-center">
								<NuxtLink :to="`/dashboard/users/requests/${slotProps.data.id}`" class="w-full">
									<Button class="w-full" label="View" size="small"/>
								</NuxtLink>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
		<Card class="">
			<template #title>
				User Sessions
			</template>
			<template #content>
				<DataTable :loading="pending" :rows="10" :value="application?.data?.userSessions"
						   class="text-nowrap"
						   currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator
						   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" showGridlines size="small">
					<Column field="id" header="id"/>
					<Column field="user.username" header="Username"/>
					<Column field="application.name" header="Application"/>
					<Column field="operatingSystem" header="OS"/>
					<Column field="organization" header="IP Address"/>
					<Column field="createdAt" header="Date">
						<template #body="slotProps">
							<div>{{
									new Date(slotProps.data.createdAt).toLocaleDateString('en-us', {
										month: 'short',
										day: '2-digit',
										year: 'numeric'
									})
								}}
							</div>
						</template>
					</Column>
					<Column field="createdAt" header="Time">
						<template #body="slotProps">
							<div>{{ new Date(slotProps.data.createdAt).toLocaleTimeString() }}</div>
						</template>
					</Column>
					<Column field="status" header="Status">
						<template #body="slotProps">
							<div class="flex justify-center">
								<div :class="slotProps.data.firstName === 'Chris' ? 'bg-green-500' : 'bg-orange-500'"
									 class="w-4 h-4 rounded-full animate-pulse"/>
							</div>
						</template>
					</Column>
					<Column body-style="{width: fit-content}" header="Action(s)"
							header-style="{max-width: fit-content}">
						<template #body="slotProps">
							<div class="flex justify-center">
								<NuxtLink :to="`/dashboard/users/requests/${slotProps.data.id}`" class="w-full">
									<Button class="w-full" label="View" size="small"/>
								</NuxtLink>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
		<Card>
			<template #title>
				Logs
			</template>
			<template #content>
				<DataTable :loading="pending" :rows="10" :value="application?.data?.logs"
						   class="text-nowrap"
						   currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator
						   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" showGridlines size="small">
					<Column class="w-fit" field="id" header="ID"/>
					<Column field="" header="Level">
						<template #body="slotProps">
							<Tag :severity="getAccountSeverity(slotProps.data.accountEnabled)"
								 :value="slotProps.data.level" class="w-full"/>
						</template>
					</Column>
					<Column field="userId" header="User"/>
					<Column field="action" header="Action"/>
					<Column field="message" header="Message"/>
					<Column field="createdAt" header="Date">
						<template #body="slotProps">
							<div>{{
									new Date(slotProps.data.createdAt).toLocaleDateString('en-us', {
										month: 'short',
										day: '2-digit',
										year: 'numeric'
									})
								}}
							</div>
						</template>
					</Column>
					<Column field="createdAt" header="Time">
						<template #body="slotProps">
							<div>{{ new Date(slotProps.data.createdAt).toLocaleTimeString() }}</div>
						</template>
					</Column>
					<!--          <Column field="metadata" header="Metadata"/>-->
				</DataTable>
			</template>
		</Card>
	</div>
</template>
