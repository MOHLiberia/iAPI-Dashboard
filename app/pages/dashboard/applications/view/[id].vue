<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';

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
  switch(accountEnabled) {
    case true:
      return 'success'
    case false:
      return 'danger'
    default:
      return 'warn'
  }
}

const getLogSeverity = (log: 'Info' | 'Warning' | 'Error') => {
  switch(log) {
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
    <Dialog v-model:visible="showDeleteDialog" modal :header="dialogHeader">
      <p class="text-surface-500 dark:text-surface-400 mb-4 text-center">Are you sure you want to delete {{application.data.name}}?</p>
      <p class="text-surface-500 dark:text-surface-400">This cannot be <span class="font-bold uppercase">undone</span> and <span class="font-bold uppercase">all data</span> will be permanently deleted!</p>
      <div class="flex justify-between gap-2 mt-4">
        <Button type="button" label="Cancel" severity="success" @click="showDeleteDialog = false" :loading :disabled="loading"/>
        <Button type="button" label="Delete" severity="danger" @click="deleteApplication" :loading :disabled="loading"/>
      </div>
    </Dialog>
    <Card class="">
      <template #title>
        <div class="flex">
          <div class="w-full">Details</div>
          <Button size="small" v-if="!isEditing" @click="edit">
            <Icon name="tabler:edit" size="1.25rem"/>
            <span>Edit</span>
          </Button>
          <div class="flex gap-2" v-if="isEditing">
            <Button size="small" @click="edit" severity="success">
              <Icon name="mingcute:save-2-line" size="1.25rem"/>
              <span>Save</span>
            </Button>
            <Button size="small" severity="danger" class="text-nowrap" @click="showDeleteDialog = !showDeleteDialog">
              <Icon name="tabler:trash" size="1.25rem"/>
              <span>Delete Application</span>
            </Button>
            <Button size="small" @click="cancelEdit" severity="danger">
              <Icon name="tabler:cancel" size="1.25rem"/>
              <span>Cancel</span>
            </Button>
          </div>
        </div>
      </template>
      <template #content>
        <Form>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField v-slot="$field" name="name" :initialValue="application?.data?.name" class="space-y-1">
                <label for="name">Name</label>
                <InputText id="name" class="w-full" type="text" :disabled="!isEditing"/>
              <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
            </FormField>
            <FormField v-slot="$field" name="typr" :initialValue="application?.data?.type" class="space-y-1">
              <label for="type">Type</label>
              <Select id="type" :options="types" optionLabel="name" optionValue="name" fluid showClear :disabled="!isEditing" />
              <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
            </FormField>
            <FormField v-slot="$field" name="description" :initialValue="application?.data?.description" class="space-y-1">
                <label for="description">Description</label>
                <InputText id="description" class="w-full" type="text" :disabled="!isEditing" />
              <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
            </FormField>
            <FormField v-slot="$field" name="baseURL" :initialValue="application?.data?.baseURL" class="space-y-1">
              <label for="description">URL</label>
              <InputText id="description" class="w-full" type="text" :disabled="!isEditing" />
              <Message v-if="$field.invalid" severity="error" size="small" variant="simple">{{ $field.error.message }}</Message>
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
        <DataTable v-model:filters="filters" :global-filter-fields="['firstname', 'lastname']" :value="application?.data?.AccountRequests" paginator :rows="10" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" class="text-nowrap" :loading="pending" size="small" showGridlines>
          <template #header>
            <div class="flex justify-between">
              <Button type="button" size="small" label="Clear" @click="clearFilter()" />
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText size="small" v-model="filters['global'].value" placeholder="Keyword Search" />
              </IconField>
            </div>
          </template>
          <Column field="firstName" header="First Name"/>
          <Column field="lastName" header="Last Name"/>
          <Column field="email" header="Email"/>
          <Column field="organization" header="Organization"/>
          <Column field="status" header="Status">
            <template #body="slotProps">
              <div class="flex justify-center">
                <div class="w-4 h-4 rounded-full animate-pulse" :class="slotProps.data.firstName === 'Chris' ? 'bg-green-500' : 'bg-orange-500'"/>
              </div>
            </template>
          </Column>
          <Column header="Action(s)" body-style="{width: fit-content}" header-style="{max-width: fit-content}">
            <template #body="slotProps">
              <div class="flex justify-center">
                <NuxtLink :to="`/dashboard/users/requests/${slotProps.data.id}`" class="w-full">
                  <Button label="View" size="small" class="w-full"/>
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
        <DataTable :value="application?.data?.users" paginator :rows="10" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" class="text-nowrap" :loading="pending" size="small" showGridlines>
          <Column field="profile.firstName" header="First Name"/>
          <Column field="profile.lastName" header="Last Name"/>
          <Column field="email" header="Email"/>
          <Column field="profile.organization.name" header="Organization"/>
          <Column field="" header="Account Status">
            <template #body="slotProps">
              <Tag :value="slotProps.data.accountEnabled ? 'Enabled' : 'Disabled'" :severity="getAccountSeverity(slotProps.data.accountEnabled)" class="w-full" />
            </template>
          </Column>
          <Column header="Action(s)" body-style="{width: fit-content}" header-style="{max-width: fit-content}">
            <template #body="slotProps">
              <div class="flex justify-center">
                <NuxtLink :to="`/dashboard/users/requests/${slotProps.data.id}`" class="w-full">
                  <Button label="View" size="small" class="w-full"/>
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
        <DataTable :value="application?.data?.userSessions" paginator :rows="10" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" class="text-nowrap" :loading="pending" size="small" showGridlines>
          <Column field="id" header="id"/>
          <Column field="user.username" header="Username"/>
          <Column field="application.name" header="Application"/>
          <Column field="operatingSystem" header="OS"/>
          <Column field="organization" header="IP Address"/>
          <Column field="createdAt" header="Date">
            <template #body="slotProps">
              <div>{{ new Date(slotProps.data.createdAt).toLocaleDateString('en-us', {month: 'short', day: '2-digit', year: 'numeric'}) }}</div>
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
                <div class="w-4 h-4 rounded-full animate-pulse" :class="slotProps.data.firstName === 'Chris' ? 'bg-green-500' : 'bg-orange-500'"/>
              </div>
            </template>
          </Column>
          <Column header="Action(s)" body-style="{width: fit-content}" header-style="{max-width: fit-content}">
            <template #body="slotProps">
              <div class="flex justify-center">
                <NuxtLink :to="`/dashboard/users/requests/${slotProps.data.id}`" class="w-full">
                  <Button label="View" size="small" class="w-full"/>
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
        <DataTable :value="application?.data?.logs" paginator :rows="10" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} to {last} of {totalRecords}" class="text-nowrap" :loading="pending" size="small" showGridlines>
          <Column field="id" header="ID" class="w-fit"/>
          <Column field="" header="Level">
            <template #body="slotProps">
              <Tag :value="slotProps.data.level" :severity="getAccountSeverity(slotProps.data.accountEnabled)" class="w-full" />
            </template>
          </Column>
          <Column field="userId" header="User"/>
          <Column field="action" header="Action"/>
          <Column field="message" header="Message"/>
          <Column field="createdAt" header="Date">
            <template #body="slotProps">
              <div>{{ new Date(slotProps.data.createdAt).toLocaleDateString('en-us', {month: 'short', day: '2-digit', year: 'numeric'}) }}</div>
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
