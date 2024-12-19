<script setup lang="ts">
import {capitalizeFirstLetter} from "~/utils";

interface Breadcrumb {
  label: string;
  to: string;
  icon: string | undefined;
}

const route = useRoute();
const router = useRouter();

const breadcrumbs = ref<Breadcrumb[]>([])

watchEffect(() => {
  const segments = route.path.split('/').filter((segment) => segment);
  breadcrumbs.value = segments.map((segment, index) => {
    const to = '/' + segments.slice(0, index + 1).join('/');

    const matchedRoute = route.matched[index]

    return {
      label: capitalizeFirstLetter(segment),
      to: to,
      icon: matchedRoute?.meta.icon,
    }
  })

  if (typeof route.name === 'string' && segments[segments.length - 1] !== route.name) {
    breadcrumbs.value.push({
      label: capitalizeFirstLetter(route.name),
      to: route.fullPath,
      icon: route.meta.icon,
    })
  }
})


</script>

<template>
  {{breadcrumbs}}
  <Breadcrumb :model="breadcrumbs">
    <template #item="{item, props}">
      <NuxtLink :to="item.to">
<!--        <Icon :name="item.icon"/>-->
        {{item.icon}}
        <span>{{item.label}}</span>
      </NuxtLink>
    </template>
  </Breadcrumb>
</template>

