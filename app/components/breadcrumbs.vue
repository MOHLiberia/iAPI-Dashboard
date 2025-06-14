<script lang="ts" setup>
import {useBreadcrumbs} from "~/composables/useBreadcrumbs";

const {breadcrumbs} = useBreadcrumbs()
</script>

<template>
	<div class="flex flex-wrap w-full overflow-hidden">
		<Breadcrumb :model="breadcrumbs" class="rounded w-fit !p-2 !bg-transparent">
			<template #item="{ item, props }">
				<NuxtLink v-if="item.path" :to="item.path"
						  class="flex gap-1 items-center group whitespace-nowrap truncate max-w-[150px] sm:max-w-full">
					<Icon :name="item.meta?.icon || 'tabler:circle'" size="1.25rem"/>
					<span class="group-hover:underline underline-offset-4">{{ item.meta.label }}</span>
				</NuxtLink>
				<div v-else class="flex gap-1 items-center">
					<Icon :name="item?.icon || 'tabler:circle'" size="1.25rem"/>
				</div>
			</template>
		</Breadcrumb>
	</div>
</template>
