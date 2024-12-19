<script setup lang="ts">
import {useRoute} from "#app";

const openSideMenu = ref(true);
const route = useRoute()

const router = useRouter();
</script>

<template>
  <div class="flex flex-col">
    <default-header v-on:openSideMenu="openSideMenu=!openSideMenu"/>
    <div class="flex flex-1">
      <sideMenu :open="openSideMenu"/>
      <div class="flex flex-col flex-1 overflow-x-hidden">
        <div class="flex-1 p-4 overflow-x-hidden overflow-y-auto">
          <breadcrumbs/>
          <div class="text-lg mb-4">{{route.name}}</div>
          <slot/>
        </div>
        <default-footer/>
      </div>
    </div>
  </div>
</template>