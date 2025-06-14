<script lang="ts" setup>
import {FilterMatchMode} from "@primevue/core";

definePageMeta({
	label: "Applications",
	icon: "tabler:app-window"
})

const config = useRuntimeConfig()
const {data: applications, pending} = useFetch(`${config.public.apiUrl}/application`, {
	method: 'GET',
	headers: {
		'api-key': config.public.apiKey.toString(),
		'content-type': 'application/json'
	},
})

</script>

<template>
	<div class="flex flex-col gap-4">
		<div class="grid grid-cols-2 md:grid-cols-5 gap-4">
			<Card class="w-full col-span-2 sm:col-span-1">
				<template #title>
					<div class="w-full text-center text-base md:text-xl">Total Applications</div>
				</template>
				<template #content>
					<Icon v-if="pending" class="w-full text-center text-4xl md:text-6xl animate-spin"
						  name="tabler:loader-2"/>
					<div v-else class="w-full text-4xl md:text-6xl text-center">{{ applications?.data?.length }}</div>
				</template>
			</Card>
			<Card class="w-full">
				<template #title>
					<div class="w-full text-center text-base md:text-lg">Web Applications</div>
				</template>
				<template #content>
					<Icon v-if="pending" class="w-full text-center text-4xl md:text-6xl animate-spin"
						  name="tabler:loader-2"/>
					<div v-else class="w-full text-4xl md:text-6xl text-center">
						{{ applications?.data?.filter((obj) => obj.type === 'Web').length }}
					</div>
				</template>
			</Card>
			<Card class="w-full">
				<template #title>
					<div class="w-full text-center text-base md:text-xl">Desktop Applications</div>
				</template>
				<template #content>
					<Icon v-if="pending" class="w-full text-center text-4xl md:text-6xl animate-spin"
						  name="tabler:loader-2"/>
					<div v-else class="w-full text-4xl md:text-6xl text-center">
						{{ applications?.data?.filter((obj) => obj.type === 'Desktop').length }}
					</div>
				</template>
			</Card>
			<Card class="w-full">
				<template #title>
					<div class="w-full text-center text-base md:text-xl">Mobile Applications</div>
				</template>
				<template #content>
					<Icon v-if="pending" class="w-full text-center text-4xl md:text-6xl animate-spin"
						  name="tabler:loader-2"/>
					<div v-else class="w-full text-4xl md:text-6xl text-center">
						{{ applications?.data?.filter((obj) => obj.type === 'Mobile').length }}
					</div>
				</template>
			</Card>
			<Card class="w-full">
				<template #title>
					<div class="w-full text-center text-base md:text-xl">Hybrid Applications</div>
				</template>
				<template #content>
					<Icon v-if="pending" class="w-full text-center text-4xl md:text-6xl animate-spin"
						  name="tabler:loader-2"/>
					<div v-else class="w-full text-4xl md:text-6xl text-center">
						{{ applications?.data?.filter((obj) => obj.type === 'Hybrid').length }}
					</div>
				</template>
			</Card>
		</div>
		<div class="overflow-hidden rounded flex flex-col gap-2">
			<div class="text-lg">Applications</div>
			<DataTable :loading="pending" :rows="10" :value="applications?.data"
					   class="text-nowrap"
					   currentPageReportTemplate="{first} to {last} of {totalRecords}" paginator paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
					   removableSort showGridlines size="small">
				<Column field="name" header="Name" sortable/>
				<Column field="type" header="Type" sortable/>
				<Column field="baseURL" header="URL">
					<template #body="slotProps">
						<a :href="slotProps.data.baseURL" class="text-blue-500 hover:underline underline-offset-2"
						   target="_blank">{{ slotProps.data.baseURL }}</a>
					</template>
				</Column>
				<Column class="!w-fit" field="description" header="Description"/>
				<Column class="w-[100px]" field="status" header="Status">
					<template #body="slotProps">
						<div class="flex justify-center">
							<div class="w-4 h-4 bg-red-500 rounded-full self-center animate-pulse"/>
						</div>
					</template>
				</Column>
				<column body-style="{width: fit-content}" header="Actions" header-style="{max-width: fit-content}">
					<template #body="slotProps">
						<div class="flex justify-center">
							<NuxtLink :to="`/dashboard/applications/view/${slotProps.data.id}`">
								<Button label="View" size="small"/>
							</NuxtLink>
						</div>
					</template>
				</column>
				<template v-if="pending" #footer>There are <span
					class="font-semibold">{{ applications ? applications?.data.length : 0 }}</span> applications using
					the iAPI.
				</template>
			</DataTable>
		</div>
	</div>
</template>
