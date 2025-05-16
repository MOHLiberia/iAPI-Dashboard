<script setup lang="ts">

definePageMeta({
  label: 'Users',
  icon: 'tabler:users'
})

const config = useRuntimeConfig()

const {data: users, pending} = useFetch(`${config.public.apiUrl}/user`, {
  method: 'GET',
  headers: {
    'api-key': config.public.apiKey.toString(),
    'content-type': 'application/json'
  },
  query: { organization: true },
  credentials: "include"
})

const getAccountSeverity = (accountEnabled: boolean) => {
  switch(accountEnabled) {
    case true:
      return 'success'
    case false:
      return 'danger'
    default:
      return 'warn'
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="overflow-hidden rounded">
      <DataTable :value="users?.data" paginator :rows="10" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" :loading="pending" size="small" showGridlines removableSort class="text-nowrap">
        <Column field="id" header="ID" sortable/>
        <Column field="username" header="Username" sortable/>
        <Column field="profile.firstName" header="First Name" sortable/>
        <Column field="profile.middleName" header="Middle Name" sortable/>
        <Column field="profile.lastName" header="Last Name" sortable/>
        <Column field="profile.organization.name" header="Organization" sortable/>
        <Column field="" header="Account Status">
          <template #body="slotProps">
            <Tag :value="slotProps.data.accountEnabled ? 'Enabled' : 'Disabled'" :severity="getAccountSeverity(slotProps.data.accountEnabled)" class="w-full" />
          </template>
        </Column>
<!--        <Column field="baseURL" header="URL">-->
<!--          <template #body="slotProps">-->
<!--            <a :href="slotProps.data.baseURL" target="_blank" class="text-blue-500 hover:underline underline-offset-2">{{slotProps.data.baseURL}}</a>-->
<!--          </template>-->
<!--        </Column>-->
<!--        <Column field="description" header="Description" class="!w-fit"/>-->
<!--        <Column field="status" header="Status" class="w-[100px]">-->
<!--          <template #body="slotProps">-->
<!--            <div class="flex justify-center">-->
<!--              <div class="w-4 h-4 bg-red-500 rounded-full self-center animate-pulse"/>-->
<!--            </div>-->
<!--          </template>-->
<!--        </Column>-->
        <column header="Actions" body-style="{width: fit-content}" header-style="{max-width: fit-content}">
          <template #body="slotProps">
            <div class="flex justify-center">
              <NuxtLink :to="`/dashboard/users/view/${slotProps.data.id}`">
                <Button label="View" size="small"/>
              </NuxtLink>
            </div>
          </template>
        </column>
        <template #footer v-if="pending">There are <span class="font-semibold">{{ users ? users?.data.length : 0 }}</span> applications using the iAPI. </template>
      </DataTable>
    </div>
  </div>
</template>

