<script setup lang="ts">
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
          <Icon name="tabler:loader-2" class="w-full text-center text-4xl md:text-6xl animate-spin" v-if="pending"/>
          <div v-else class="w-full text-4xl md:text-6xl text-center">{{applications?.data?.length}}</div>
        </template>
      </Card>
      <Card class="w-full">
        <template #title>
          <div class="w-full text-center text-base md:text-lg">Web Applications</div>
        </template>
        <template #content>
          <Icon name="tabler:loader-2" class="w-full text-center text-4xl md:text-6xl animate-spin" v-if="pending"/>
          <div v-else class="w-full text-4xl md:text-6xl text-center">{{applications?.data?.filter((obj) => obj.type === 'Web').length}}</div>
        </template>
      </Card>
      <Card class="w-full">
        <template #title>
          <div class="w-full text-center text-base md:text-xl">Desktop Applications</div>
        </template>
        <template #content>
          <Icon name="tabler:loader-2" class="w-full text-center text-4xl md:text-6xl animate-spin" v-if="pending"/>
          <div v-else class="w-full text-4xl md:text-6xl text-center">{{applications?.data?.filter((obj) => obj.type === 'Desktop').length}}</div>
        </template>
      </Card>
      <Card class="w-full">
        <template #title>
          <div class="w-full text-center text-base md:text-xl">Mobile Applications</div>
        </template>
        <template #content>
          <Icon name="tabler:loader-2" class="w-full text-center text-4xl md:text-6xl animate-spin" v-if="pending"/>
          <div v-else class="w-full text-4xl md:text-6xl text-center">{{applications?.data?.filter((obj) => obj.type === 'Mobile').length}}</div>
        </template>
      </Card>
      <Card class="w-full">
        <template #title>
          <div class="w-full text-center text-base md:text-xl">Hybrid Applications</div>
        </template>
        <template #content>
          <Icon name="tabler:loader-2" class="w-full text-center text-4xl md:text-6xl animate-spin" v-if="pending"/>
          <div v-else class="w-full text-4xl md:text-6xl text-center">{{applications?.data?.filter((obj) => obj.type === 'Hybrid').length}}</div>
        </template>
      </Card>
    </div>
    <div class="overflow-hidden rounded">
      <DataTable :value="applications?.data" paginator :rows="10" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" :loading="pending" size="small" showGridlines removableSort class="text-nowrap">
        <Column field="name" header="Name" sortable/>
        <Column field="type" header="Type" sortable/>
        <Column field="baseURL" header="URL">
          <template #body="slotProps">
            <a :href="slotProps.data.baseURL" target="_blank" class="text-blue-500 hover:underline underline-offset-2">{{slotProps.data.baseURL}}</a>
          </template>
        </Column>
        <Column field="description" header="Description" class="!w-fit"/>
        <Column field="status" header="Status" class="w-[100px]">
          <template #body="slotProps">
            <div class="flex justify-center">
              <div class="w-4 h-4 bg-red-500 rounded-full self-center animate-pulse"/>
            </div>
          </template>
        </Column>
        <column header="Actions" body-style="{width: fit-content}" header-style="{max-width: fit-content}">
          <template #body="slotProps">
            <div class="flex justify-center">
              <NuxtLink :to="`/dashboard/applications/view/${slotProps.data.id}`">
                <Button label="View" size="small"/>
              </NuxtLink>
            </div>
          </template>
        </column>
        <template #footer v-if="pending">There are <span class="font-semibold">{{ applications ? applications?.data.length : 0 }}</span> applications using the iAPI. </template>
      </DataTable>
    </div>
  </div>
</template>
