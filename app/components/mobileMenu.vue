<script setup lang="ts">
import {mainMenuList} from "~/utils/menus";

const openMenu = ref(false)
</script>

<template>
  <div class="block lg:hidden">
    <Button variant="text" severity="contrast" @click="openMenu = !openMenu" class="!p-1">
      <Icon name="tabler:menu-2" size="1.5rem"/>
    </Button>
  </div>
  <drawer v-model:visible="openMenu">
    <template #header>
      <div class="flex items-center gap-2">
        <img src="~/assets/images/moh-logo.svg" alt="MOH Logo" class="h-12"/>
        <div class="text-sm">
          <p>Interoperability API</p>
          <p>Dashboard</p>
        </div>
      </div>
    </template>
    <menuList :menuList="mainMenuList"/>
<!--      <div class="overflow-y-auto space-y-2 h-full">-->
<!--        <div class="rounded flex border dark:border-slate-800 hover:dark:bg-slate-700 p-2" v-for="list in mainMenuList">-->
<!--          <NuxtLink :to="list.to" class="flex-1 flex gap-2 items-center text-lg">-->
<!--            <Icon :name="list.icon" size="1.25rem"/>-->
<!--            <span>{{list.name}}</span>-->
<!--          </NuxtLink>-->
<!--        </div>-->
<!--      </div>-->
<!--    <template #footer>-->
<!--        <NuxtLink class="w-full rounded border dark:border-slate-800 dark:hover:bg-slate-800/35 p-2 group flex items-center gap-2" to="/dashboard/account">-->
<!--          <div class="h-10 w-10 rounded-full border-slate-800 bg-green-300"/>-->
<!--          <div class="flex flex-col text-sm">-->
<!--            <div>Calvin Coleman</div>-->
<!--            <div>ICT Director</div>-->
<!--          </div>-->
<!--        </NuxtLink>-->
<!--    </template>-->
  </drawer>
</template>