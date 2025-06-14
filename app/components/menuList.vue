<script lang="ts" setup>
const useUser = useUserStore()

type MenuItem = {
	to: string;
	icon: string;
	name: string;
	openSubmenu?: boolean;
	subMenu: Array<{
		to: string;
		icon: string;
		name: string;
	}>;
};

const open = ref(false);

const props = defineProps<{
	menuList: MenuItem[]
}>()

const localMenuList = ref(props.menuList);
const toggleSubmenu = (index: number) => {
	localMenuList.value[index].openSubmenu = !localMenuList.value[index].openSubmenu;
}
</script>

<template>
	<nav :class="open ? 'w-[225px]' : 'w-fit'" class="dark:border-slate-800 border-r lg:flex flex-col hidden shrink-0">
		<div class="flex-1 overflow-y-auto space-y-2 w-full p-2">
			<div v-for="(list, idx) in menuList" :key="idx" :class="list.openSubmenu ? '' : ''"
				 class="rounded flex flex-col border dark:border-slate-800">
				<div class="flex flex-1 dark:hover:bg-slate-800">
					<NuxtLink :to="list.to" class="flex-1 flex gap-2 items-center p-2">
						<Icon :name="list.icon" size="1.25rem"/>
						<span v-show="open">{{ list.name }}</span>
					</NuxtLink>
					<div v-if="open && list.subMenu.length > 0"
						 class="flex items-center justify-center px-4 py-2 hover:cursor-pointer text-slate-300" @click="toggleSubmenu(idx)">
						<Icon name="tabler:chevron-down"/>
					</div>
				</div>
				<div v-if="list.openSubmenu && open" class="ml-4 flex flex-col">
					<div v-for="subList in list.subMenu"
						 class="dark:hover:bg-slate-800 border-l border-slate-800 last:mb-2">
						<NuxtLink :to="subList.to" class="flex-1 flex gap-2 items-center p-2">
							<Icon :name="subList.icon" size="1.25rem"/>
							<span>{{ subList.name }}</span>
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
		<div class="p-2">
			<NuxtLink
				v-if="open"
				class="w-full rounded border dark:border-slate-800 dark:hover:bg-slate-800 hover:bg-slate-100 p-2 group flex items-center gap-4" to="/dashboard/account">
				<div class="h-10 w-10 rounded-full border-slate-800 bg-green-300"/>
				<div v-show="open" class="flex flex-col text-sm">
					<div>{{ useUser.user?.profile?.firstName }} {{ useUser.user?.profile?.lastName }}</div>
					<div>{{ useUser.user?.username }}</div>
				</div>
			</NuxtLink>
			<NuxtLink
				v-else
				class="h-10 w-10 rounded-full overflow-hidden border dark:border-slate-800 dark:hover:bg-slate-800/35 group flex items-center gap-2" to="/dashboard/account">
				<div class="w-full h-full bg-green-300"/>
			</NuxtLink>
		</div>
	</nav>
</template>