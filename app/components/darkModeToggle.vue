<script lang="ts" setup>
import {useColorMode} from "#imports";

const selectedTheme = ref({name: 'system', icon: 'tabler:device-desktop'})

const op = ref()

const themes = ref([
	{name: 'System', icon: 'tabler:device-desktop', value: 'system'},
	{name: 'Light', icon: 'tabler:sun', value: 'light'},
	{name: 'Dark', icon: 'tabler:moon', value: 'dark'},
])

const selectTheme = (theme) => {
	selectedTheme.value = theme
}

const togglePopover = (e) => {
	op.value.toggle(e)
}
</script>

<template>
	<Button class="!p-2" severity="contrast" variant="text" @click="togglePopover">
		<Icon :name="selectedTheme.icon" size="1.5rem"/>
	</Button>
	<Popover ref="op">
		<ul class="list-none p-0 m-0 flex flex-col">
			<li v-for="theme in themes" :key="theme.name"
				class="flex items-center gap-2 p-2 hover:bg-slate-800 rounded cursor-pointer rounded-border"
				@click="selectTheme(theme)">
				<Icon :name="theme.icon" size="1.5rem"/>
				<div>
					<span class="font-medium">{{ theme.name }}</span>
				</div>
			</li>
		</ul>
	</Popover>
</template>
