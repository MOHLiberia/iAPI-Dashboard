<script setup lang="ts">

definePageMeta({
  name: 'Application Details',
  breadcrumb: 'Application Details',
  icon: 'tabler:app-window-filled'
})

const route = useRoute()
const config = useRuntimeConfig()

const {data: application, pending} = useFetch(`${config.public.apiUrl}/application/${route.params.id}`, {
  method: 'GET',
  headers: {
    'api-key': config.public.apiKey.toString(),
    'content-type': 'application/json'
  },
})

</script>

<template>
  <div class="flex flex-col gap-4">
      <Button size="small" class="w-fit">
        <Icon name="tabler:edit"/>
        <span>Edit</span>
      </Button>
    <Card>
      <template #title>
        Hello
      </template>
    </Card>
  </div>
</template>
