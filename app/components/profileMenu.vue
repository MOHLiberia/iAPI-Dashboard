<script setup lang="ts">
import {profileMenuList} from "~/utils/menus";

const popover = ref()

const togglePopover = (e) => {
  popover.value.toggle(e)
}

const useUser = useUserStore()
const useAuth = useAuthStore()
</script>

<template>
  <div class="h-9 w-9 rounded-full bg-slate-300 border-2 border-slate-500 dark:bg-slate-700 dark:hover:bg-slate-700/80 overflow-hidden hover:cursor-pointer flex items-center justify-center" @click="togglePopover">
    <div class="w-full h-full text-sm flex items-center justify-center">CC</div>
  </div>
  <Popover ref="popover" class="!p-0">
      <div class="mb-2 px-2 pb-2 border-b dark:border-slate-800 select-none">Calvin Coleman</div>
      <ul class="list-none p-0 m-0 flex flex-col">
        <li v-for="list in profileMenuList">
          <NuxtLink :to="list.to" class="flex items-center gap-3 p-2 dark:hover:bg-slate-800 hover:bg-slate-200 rounded">
            <Icon :name="list.icon" size="1.5rem"/>
            <span>{{list.label}}</span>
          </NuxtLink>
        </li>
        <li class="border-t border-slate-800 my-2"/>
        <li class="flex items-center gap-3 p-2 dark:hover:bg-red-500 hover:bg-red-500 rounded hover:cursor-pointer select-none" @click="useAuth.logout()">
          <Icon name="tabler:logout" size="1.5rem"/>
          <span>Logout</span>
        </li>
      </ul>
  </Popover>
</template>

