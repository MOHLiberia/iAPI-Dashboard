<script setup lang="ts">
import {useRoute} from "#app";

const openSideMenu = ref(true);
const route = useRoute()

const router = useRouter();
</script>

<template>
  <div class="flex flex-col">
    <default-header v-on:openSideMenu="openSideMenu=!openSideMenu"/>
    <div class="flex flex-1 overflow-hidden">
      <sideMenu :open="openSideMenu"/>
      <div class="flex-1 overflow-hidden">
        <div class="p-4 h-full overflow-x-hidden overflow-y-auto space-y-4">
          <breadcrumbs/>
          <slot/>
        </div>
      </div>
    </div>
    <default-footer/>
  </div>
</template>