<script setup lang="ts">
import type {RouteRecordNormalized} from "#vue-router";

const route = useRoute();
const router = useRouter();
const breadcrumbs = ref([])

watchEffect(() => {
  breadcrumbs.value= [];
  const fullPath = route.path
  const requestPath = fullPath.startsWith("/") ? fullPath.substring(1) : fullPath
  const crumbs = requestPath.split("/")
  let path = ""

  crumbs.forEach((crumb) => {
    if (crumb) {
      path = `${path}/${crumb}`;
      const breadcrumb = router.getRoutes().find((r) => r.path === path);
      if (breadcrumb) {
        breadcrumbs.value.push(breadcrumb);
      }
    }
  })

  if (!breadcrumbs.value.some(breadcrumb => breadcrumb.path === route.path)) {
    breadcrumbs.value.push(route);
  }
})
</script>

<template>
  <Breadcrumb :model="breadcrumbs" class="rounded w-fit !p-2 !bg-transparent">
    <template #item="{item, props}">
      <NuxtLink v-if="item.path" :to="item.path" class="flex gap-1 items-center group">
        <Icon :name="item.meta?.icon" size="1.25rem"/>
        <span class="group-hover:underline underline-offset-4">{{item.meta.label}}</span>
      </NuxtLink>
      <div v-else class="flex gap-1 items-center">
        <Icon :name="item?.icon" size="1.25rem"/>
        <span>{{item?.label}}</span>
      </div>
    </template>
  </Breadcrumb>
</template>

