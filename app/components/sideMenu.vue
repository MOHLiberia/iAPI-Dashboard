<script setup lang="ts">
import { mainMenuList } from '~/utils/menus'

const props = defineProps<{
  open: Boolean
}>()

const menuList = ref(mainMenuList)
const useUser = useUserStore()
</script>

<template>
  <Transition
      enter-active-class="transition-all duration-300 ease-in-out"
      leave-active-class="transition-all duration-300 ease-in-out"
      enter-from-class="opacity-0 -translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-full"
  >
    <nav class="dark:border-slate-800 border-r lg:flex flex-col hidden shrink-0" :class="props.open ? 'w-[225px]' : 'w-fit'">
      <div class="flex-1 overflow-y-auto space-y-2 w-full p-2">
        <div class="rounded flex flex-col border dark:border-slate-800" v-for="list in menuList" :class="list.openSubmenu ? '' : ''">
          <div class="flex flex-1 dark:hover:bg-slate-800">
            <NuxtLink :to="list.to" class="flex-1 flex gap-2 items-center p-2">
              <Icon :name="list.icon" size="1.25rem"/>
              <span v-show="props.open">{{list.name}}</span>
            </NuxtLink>
            <div class="flex items-center justify-center px-4 py-2 hover:cursor-pointer text-slate-300" v-if="open && list.subMenu.length > 0" @click="list.openSubmenu = !list.openSubmenu">
              <Icon name="tabler:chevron-down"/>
            </div>
          </div>
          <div v-if="list.openSubmenu && open" class="ml-4 flex flex-col">
            <div class="dark:hover:bg-slate-800 border-l border-slate-800 last:mb-2" v-for="subList in list.subMenu">
              <NuxtLink :to="subList.to" class="flex-1 flex gap-2 items-center p-2">
                <Icon :name="subList.icon" size="1.25rem"/>
                <span>{{subList.name}}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div class="p-2">
        <NuxtLink class="w-full rounded border dark:border-slate-800 dark:hover:bg-slate-800 hover:bg-slate-100 p-2 group flex items-center gap-4" to="/dashboard/account" v-if="open">
          <div class="h-10 w-10 rounded-full border-slate-800 bg-green-300"/>
          <div class="flex flex-col text-sm" v-show="open">
            <div>{{useUser.user.profile.firstName}} {{useUser.user.profile.lastName}}</div>
            <div>{{useUser.user.username}}</div>
          </div>
        </NuxtLink>
        <NuxtLink class="h-10 w-10 rounded-full overflow-hidden border dark:border-slate-800 dark:hover:bg-slate-800/35 group flex items-center gap-2" to="/dashboard/account" v-else>
          <div class="w-full h-full bg-green-300"/>
        </NuxtLink>
      </div>
    </nav>
  </Transition>
</template>
